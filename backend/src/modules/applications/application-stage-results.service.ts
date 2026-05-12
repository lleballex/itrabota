import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, EntityManager, Repository } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"

import { ApplicationsService } from "./applications.service"
import { UpsertCurrentApplicationStageResultDto } from "./dto/upsert-current-application-stage-result.dto"
import { ApplicationStageResult } from "./entities/application-stage-result.entity"
import { ApplicationStatus } from "./entities/application.entity"

@Injectable()
export class ApplicationStageResultsService {
  constructor(
    @InjectRepository(ApplicationStageResult)
    private readonly stageResultsRepo: Repository<ApplicationStageResult>,

    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async findAllByApplicationId(id: string, user_: ICurrentUser) {
    const user = await this.usersService.findFilledRecruiterRefById(user_.id)
    await this.findAccessibleApplication(id, user.recruiter.id, {
      includeMessages: false,
    })

    return this.stageResultsRepo.find({
      where: {
        application: { id },
      },
      relations: {
        funnelStep: true,
        authorRecruiter: true,
      },
      order: {
        funnelStep: {
          index: "ASC",
        },
        createdAt: "ASC",
      },
    })
  }

  async upsertCurrentByApplicationId(
    id: string,
    dto: UpsertCurrentApplicationStageResultDto,
    user_: ICurrentUser,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findFilledRecruiterRefById(
        user_.id,
        manager,
      )
      const application = await this.findAccessibleApplication(
        id,
        user.recruiter.id,
        {
          manager,
          includeMessages: true,
        },
      )

      if (application.status !== ApplicationStatus.Pending) {
        throw new ConflictException(
          "Stage result can only be edited for a pending application",
        )
      }

      if (!application.funnelStep?.id) {
        throw new ConflictException(
          "Stage result can only be edited for the current funnel step",
        )
      }

      if (this.applicationsService.isWaitingForCandidateResponse(application)) {
        throw new ConflictException(
          "Stage result can only be edited after the candidate accepted the current step",
        )
      }

      const normalizedData = this.normalizeDto(dto)

      if (!this.hasAnyFilledField(normalizedData)) {
        throw new BadRequestException(
          "At least one stage result field must be filled",
        )
      }

      const stageResultsRepo = manager.getRepository(ApplicationStageResult)
      const existingStageResult = await stageResultsRepo.findOne({
        where: {
          application: { id: application.id },
          funnelStep: { id: application.funnelStep.id },
        },
      })

      const savedStageResult = await stageResultsRepo.save(
        stageResultsRepo.create({
          id: existingStageResult?.id,
          application: { id: application.id },
          funnelStep: { id: application.funnelStep.id },
          authorRecruiter: { id: user.recruiter.id },
          ...normalizedData,
        }),
      )

      return this.findOneById(savedStageResult.id, manager)
    })
  }

  private async findOneById(id: string, manager?: EntityManager) {
    const repo =
      manager?.getRepository(ApplicationStageResult) ?? this.stageResultsRepo

    const stageResult = await repo.findOneOrFail({
      where: { id },
      relations: {
        funnelStep: true,
        authorRecruiter: true,
      },
    })

    return stageResult
  }

  private async findAccessibleApplication(
    id: string,
    recruiterId: string,
    options?: {
      manager?: EntityManager
      includeMessages?: boolean
    },
  ) {
    const application = options?.includeMessages
      ? await this.applicationsService._findStageResultEditContextById(
          id,
          options.manager,
        )
      : await this.applicationsService._findRecruiterAccessContextById(
          id,
          options?.manager,
        )

    if (application.vacancy?.recruiter?.id !== recruiterId) {
      throw new ForbiddenException(
        "You cannot access stage results for this application",
      )
    }

    return application
  }

  private normalizeDto(dto: UpsertCurrentApplicationStageResultDto) {
    return {
      summary: this.normalizeNullableText(dto.summary),
      pros: this.normalizeNullableText(dto.pros),
      cons: this.normalizeNullableText(dto.cons),
      notes: this.normalizeNullableText(dto.notes),
      recommendation: dto.recommendation ?? null,
    }
  }

  private normalizeNullableText(value?: string | null) {
    if (typeof value !== "string") {
      return null
    }

    const trimmedValue = value.trim()

    return trimmedValue.length ? trimmedValue : null
  }

  private hasAnyFilledField(
    data: ReturnType<ApplicationStageResultsService["normalizeDto"]>,
  ) {
    return Boolean(
      data.summary ||
        data.pros ||
        data.cons ||
        data.notes ||
        data.recommendation,
    )
  }
}
