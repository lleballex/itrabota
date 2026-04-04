import { ConflictException, Injectable } from "@nestjs/common"
import { DataSource, EntityManager } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { CandidatesService } from "@/modules/users/candidates.service"
import { AttachmentsService } from "@/modules/attachments/attachments.service"
import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { WorkExperienceService } from "@/modules/users/work-experience.service"
import { isNullish } from "@/common/lib/is-nullish"

import { CreateMeCandidateDto } from "./dto/create-me-candidate.dto"
import { UpdateMeCandidateDto } from "./dto/update-me-candidate.dto"

@Injectable()
export class MeCandidateService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly candidatesService: CandidatesService,
    private readonly usersService: UsersService,
    private readonly attachmentsService: AttachmentsService,
    private readonly workExperieceService: WorkExperienceService,
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

  private async handleAvatarUpsert(
    dto?: CreateAttachmentDto | null,
    options?: {
      candidate?: Candidate
      manager?: EntityManager
    },
  ) {
    if (dto) {
      if (options?.candidate?.avatar) {
        await this.attachmentsService.delete(
          options.candidate.avatar.id,
          options.manager,
        )
      }

      return this.attachmentsService.create(
        {
          ...dto,
          content: Buffer.from(dto.content, "base64"),
        },
        options?.manager,
      )
    } else if (dto === null && options?.candidate?.avatar) {
      await this.attachmentsService.delete(
        options.candidate.avatar.id,
        options.manager,
      )
    }
  }

  private async handleWorkExperienceUpsert(
    dto: UpdateMeCandidateDto["workExperience"],
    candidate: Candidate,
    manager?: EntityManager,
  ) {
    if (!dto) return

    if (candidate.workExperience) {
      for (const item of candidate.workExperience) {
        const itemExists = dto.some((i) => i.id === item.id)

        if (!itemExists) {
          await this.workExperieceService.remove(item.id, manager)
        }
      }
    }

    for (const itemDto of dto) {
      if (itemDto.id) {
        await this.workExperieceService.update(itemDto.id, itemDto, manager)
      } else {
        await this.workExperieceService.create(
          {
            ...itemDto,
            candidate: { id: candidate.id },
          },
          manager,
        )
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

    await this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findCandidateById(user_.id, manager)

      await this.validateEmail(email, user.id, manager)
      await this.handleEmailUpdate(email, user.id, manager)

      const avatar = await this.handleAvatarUpsert(avatarDto, {
        manager,
      })

      const candidate = await this.candidatesService.create(
        {
          ...dto,
          city: isNullish(dto.cityId) ? dto.cityId : { id: dto.cityId },
          skills: isNullish(dto.skillIds)
            ? dto.skillIds
            : dto.skillIds.map((id) => ({ id })),
          avatar: { id: avatar?.id },
          user: { id: user.id },
        },
        manager,
      )

      await this.handleWorkExperienceUpsert(
        workExperienceDto,
        candidate,
        manager,
      )
    })

    return this.usersService.findOneById(user_.id)
  }

  async update(dto_: UpdateMeCandidateDto, user_: ICurrentUser) {
    const {
      email,
      avatar: avatarDto,
      workExperience: workExperienceDto,
      ...dto
    } = dto_

    await this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findFilledCandidateById(
        user_.id,
        manager,
      )

      await this.validateEmail(email, user.id, manager)
      await this.handleEmailUpdate(email, user.id, manager)

      const avatar = await this.handleAvatarUpsert(avatarDto, {
        candidate: user.candidate,
        manager,
      })

      await this.candidatesService.update(
        user.candidate.id,
        {
          ...dto,
          city: isNullish(dto.cityId) ? dto.cityId : { id: dto.cityId },
          skills: isNullish(dto.skillIds)
            ? dto.skillIds
            : dto.skillIds.map((id) => ({ id })),
          avatar: { id: avatar?.id },
        },
        manager,
      )

      await this.handleWorkExperienceUpsert(
        workExperienceDto,
        user.candidate,
        manager,
      )
    })

    return this.usersService.findOneById(user_.id)
  }
}
