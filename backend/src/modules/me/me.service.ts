import { Injectable } from "@nestjs/common"

import { UsersService } from "@/modules/users/users.service"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { RecruitersService } from "@/modules/users/recruiters.service"
import { CompaniesService } from "@/modules/users/companies.service"
import { AttachmentsService } from "@/modules/attachments/attachments.service"

import { CreateRecruiterDto } from "./dto/create-recruiter.dto"

@Injectable()
export class MeService {
  constructor(
    private readonly usersService: UsersService,
    private readonly recruitersService: RecruitersService,
    private readonly companiesService: CompaniesService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async createRecruiter(
    {
      email,
      company: { logo: companyLogoDto, ...companyDto },
      ...recruiterDto
    }: CreateRecruiterDto,
    currentUser: ICurrentUser,
  ) {
    const user = await this.usersService.findRecruiterById(currentUser.id)

    if (
      email &&
      !(await this.usersService.isEmailAvailable(email, { userId: user.id }))
    ) {
      throw new Error("Email is already in use")
    }

    // TODO: start transaction

    if (email) {
      await this.usersService.update(user.id, { email })
    }

    const recruiter = await this.recruitersService.create({
      ...recruiterDto,
      user: {
        id: user.id,
      },
    })

    const companyLogo = companyLogoDto
      ? await this.attachmentsService.create({
          ...companyLogoDto,
          content: Buffer.from(companyLogoDto.content, "base64"),
        })
      : null

    await this.companiesService.create({
      ...companyDto,
      logo: {
        id: companyLogo?.id,
      },
      recruiter: {
        id: recruiter.id,
      },
    })

    return this.usersService.findOneById(user.id)
  }
}
