import { ConflictException, Injectable } from "@nestjs/common"
import { DataSource, EntityManager } from "typeorm"

import { UsersService } from "@/modules/users/users.service"
import { RecruitersService } from "@/modules/users/recruiters.service"
import { CompaniesService } from "@/modules/companies/companies.service"
import { AttachmentsService } from "@/modules/attachments/attachments.service"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"
import { Company } from "@/modules/companies/entities/company.entity"
import { isNullish } from "@/common/lib/is-nullish"

import { CreateMeRecruiterDto } from "./dto/create-me-recruiter.dto"
import { UpdateMeRecruiterDto } from "./dto/update-me-recruiter.dto"

// TODO: check if industry exists before creating and updating

@Injectable()
export class MeRecruiterService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly recruitersService: RecruitersService,
    private readonly companiesService: CompaniesService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  private async validateEmail(
    email: string | undefined,
    userId: string,
    manager?: EntityManager,
  ) {
    if (
      email &&
      !(await this.usersService.isEmailAvailable(email, { userId, manager }))
    ) {
      throw new ConflictException("Email is already in use")
    }
  }

  private handleEmailUpdate(
    email: string | undefined,
    userId: string,
    manager?: EntityManager,
  ) {
    if (email) {
      return this.usersService.update(userId, { email }, manager)
    }
  }

  private async handleCompanyLogoUpsert(
    dto?: CreateAttachmentDto | null,
    company?: Company,
    manager?: EntityManager,
  ) {
    if (dto) {
      if (company?.logo) {
        await this.attachmentsService.delete(company.logo.id, manager)
      }

      return this.attachmentsService.create(
        {
          ...dto,
          content: Buffer.from(dto.content, "base64"),
        },
        manager,
      )
    } else if (dto === null && company?.logo) {
      await this.attachmentsService.delete(company.logo.id, manager)
    }
  }

  async create(dto: CreateMeRecruiterDto, user_: ICurrentUser) {
    const {
      email,
      company: { logo: companyLogoDto, ...companyDto },
      ...recruiterDto
    } = dto

    await this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findRecruiterById(user_.id, manager)

      await this.validateEmail(email, user.id, manager)
      await this.handleEmailUpdate(email, user.id, manager)

      const recruiter = await this.recruitersService.create(
        {
          ...recruiterDto,
          user: { id: user.id },
        },
        manager,
      )

      const companyLogo = await this.handleCompanyLogoUpsert(
        companyLogoDto,
        undefined,
        manager,
      )

      await this.companiesService.create(
        {
          ...companyDto,
          industry: isNullish(companyDto.industryId)
            ? companyDto.industryId
            : { id: companyDto.industryId },
          logo: { id: companyLogo?.id },
          recruiter: { id: recruiter.id },
        },
        manager,
      )
    })

    return this.usersService.findOneById(user_.id)
  }

  async update(dto: UpdateMeRecruiterDto, user_: ICurrentUser) {
    const { email, company: companyDto, ...recruiterDto } = dto

    await this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      await this.validateEmail(email, user.id, manager)
      await this.handleEmailUpdate(email, user.id, manager)

      await this.recruitersService.update(
        user.recruiter.id,
        recruiterDto,
        manager,
      )

      if (companyDto) {
        if (!user.recruiter.company) {
          throw new Error("Recruiter company not specified")
        }

        const companyLogo = await this.handleCompanyLogoUpsert(
          companyDto.logo,
          user.recruiter.company,
          manager,
        )

        await this.companiesService.update(
          user.recruiter.company.id,
          {
            ...companyDto,
            industry: isNullish(companyDto.industryId)
              ? companyDto.industryId
              : { id: companyDto.industryId },
            logo: { id: companyLogo?.id },
          },
          manager,
        )
      }
    })

    return this.usersService.findOneById(user_.id)
  }
}
