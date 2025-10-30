import { ConflictException, Injectable } from "@nestjs/common"

import { UsersService } from "@/modules/users/users.service"
import { RecruitersService } from "@/modules/users/recruiters.service"
import { CompaniesService } from "@/modules/companies/companies.service"
import { AttachmentsService } from "@/modules/attachments/attachments.service"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"
import { Company } from "@/modules/companies/entities/company.entity"

import { CreateMeRecruiterDto } from "./dto/create-me-recruiter.dto"
import { UpdateMeRecruiterDto } from "./dto/update-me-recruiter.dto"

// TODO: check if industry exists before creating and updating

@Injectable()
export class MeRecruiterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly recruitersService: RecruitersService,
    private readonly companiesService: CompaniesService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  private async validateEmail(email: string | undefined, userId: string) {
    if (
      email &&
      !(await this.usersService.isEmailAvailable(email, { userId }))
    ) {
      throw new ConflictException("Email is already in use")
    }
  }

  private handleEmailUpdate(email: string | undefined, userId: string) {
    if (email) {
      return this.usersService.update(userId, { email })
    }
  }

  private async handleCompanyLogoUpsert(
    dto?: CreateAttachmentDto | null,
    company?: Company,
  ) {
    if (dto) {
      if (company?.logo) {
        await this.attachmentsService.delete(company.logo.id)
      }

      return this.attachmentsService.create({
        ...dto,
        content: Buffer.from(dto.content, "base64"),
      })
    } else if (dto === null && company?.logo) {
      await this.attachmentsService.delete(company.logo.id)
    }
  }

  async create(dto: CreateMeRecruiterDto, user_: ICurrentUser) {
    const {
      email,
      company: { logo: companyLogoDto, ...companyDto },
      ...recruiterDto
    } = dto

    const user = await this.usersService.findRecruiterById(user_.id)

    await this.validateEmail(email, user.id)

    // TODO: start transaction

    await this.handleEmailUpdate(email, user.id)

    const recruiter = await this.recruitersService.create({
      ...recruiterDto,
      user: { id: user.id },
    })

    const companyLogo = await this.handleCompanyLogoUpsert(companyLogoDto)

    await this.companiesService.create({
      ...companyDto,
      logo: { id: companyLogo?.id },
      recruiter: { id: recruiter.id },
    })

    return this.usersService.findOneById(user.id)
  }

  async update(dto: UpdateMeRecruiterDto, user_: ICurrentUser) {
    const { email, company: companyDto, ...recruiterDto } = dto

    const user = await this.usersService.findFilledRecruiterById(user_.id)

    await this.validateEmail(email, user.id)

    // TODO: start transition

    await this.handleEmailUpdate(email, user.id)

    await this.recruitersService.update(user.recruiter.id, recruiterDto)

    if (companyDto) {
      if (!user.recruiter.company) {
        throw new Error("Recruiter company not specified")
      }

      const companyLogo = await this.handleCompanyLogoUpsert(
        companyDto.logo,
        user.recruiter.company,
      )

      await this.companiesService.update(user.recruiter.company.id, {
        ...companyDto,
        logo: { id: companyLogo?.id },
      })
    }

    return this.usersService.findOneById(user.id)
  }
}
