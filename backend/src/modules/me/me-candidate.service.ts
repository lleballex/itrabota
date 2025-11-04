import { ConflictException, Injectable } from "@nestjs/common"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { CandidatesService } from "@/modules/users/candidates.service"
import { AttachmentsService } from "@/modules/attachments/attachments.service"
import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { WorkExperienceService } from "@/modules/users/work-experience.service"

import { CreateMeCandidateDto } from "./dto/create-me-candidate.dto"
import { UpdateMeCandidateDto } from "./dto/update-me-candidate.dto"

@Injectable()
export class MeCandidateService {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly usersService: UsersService,
    private readonly attachmentsService: AttachmentsService,
    private readonly workExperieceService: WorkExperienceService,
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

  private async handleAvatarUpsert(
    dto?: CreateAttachmentDto | null,
    candidate?: Candidate,
  ) {
    if (dto) {
      if (candidate?.avatar) {
        await this.attachmentsService.delete(candidate.avatar.id)
      }

      return this.attachmentsService.create({
        ...dto,
        content: Buffer.from(dto.content, "base64"),
      })
    } else if (dto === null && candidate?.avatar) {
      await this.attachmentsService.delete(candidate.avatar.id)
    }
  }

  private async handleWorkExperienceUpsert(
    dto: UpdateMeCandidateDto["workExperience"],
    candidate: Candidate,
  ) {
    if (!dto) return

    if (candidate.workExperience) {
      for (const item of candidate.workExperience) {
        const itemExists = dto.some((i) => i.id === item.id)

        if (!itemExists) {
          await this.workExperieceService.remove(item.id)
        }
      }
    }

    for (const itemDto of dto) {
      if (itemDto.id) {
        await this.workExperieceService.update(itemDto.id, itemDto)
      } else {
        await this.workExperieceService.create({
          ...itemDto,
          candidate: { id: candidate.id },
        })
      }
    }
  }

  async create(dto_: CreateMeCandidateDto, user_: ICurrentUser) {
    const {
      email,
      avatar: avatarDto,
      workExperience: workExperienceDto,
      ...dto
    } = dto_

    const user = await this.usersService.findCandidateById(user_.id)

    await this.validateEmail(email, user.id)

    // TODO: start transaction

    await this.handleEmailUpdate(email, user.id)

    const avatar = await this.handleAvatarUpsert(avatarDto)

    const candidate = await this.candidatesService.create({
      ...dto,
      city: dto.cityId ? { id: dto.cityId } : null,
      skills: dto.skillIds ? dto.skillIds.map((id) => ({ id })) : [],
      avatar: { id: avatar?.id },
      user: { id: user.id },
    })

    await this.handleWorkExperienceUpsert(workExperienceDto, candidate)

    return this.usersService.findOneById(user.id)
  }

  async update(dto_: UpdateMeCandidateDto, user_: ICurrentUser) {
    const {
      email,
      avatar: avatarDto,
      workExperience: workExperienceDto,
      ...dto
    } = dto_

    const user = await this.usersService.findFilledCandidateById(user_.id)

    await this.validateEmail(email, user.id)

    // TODO: start transtion

    await this.handleEmailUpdate(email, user.id)

    const avatar = await this.handleAvatarUpsert(avatarDto, user.candidate)

    await this.candidatesService.update(user.candidate.id, {
      ...dto,
      city: typeof dto.cityId === "string" ? { id: dto.cityId } : dto.cityId,
      skills: dto.skillIds ? dto.skillIds.map((id) => ({ id })) : dto.skillIds,
      avatar: { id: avatar?.id },
    })

    await this.handleWorkExperienceUpsert(workExperienceDto, user.candidate)

    return this.usersService.findOneById(user.id)
  }
}
