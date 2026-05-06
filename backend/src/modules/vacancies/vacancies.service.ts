import {
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { WorkExperienceItem } from "@/modules/users/entities/work-experence-item.entity"
import { UserRole } from "@/modules/users/types/user-role"
import { ApplicationsService } from "@/modules/applications/applications.service"
import { CandidatesService } from "@/modules/users/candidates.service"
import {
  createCaseInsensitiveSearchExpression,
  normalizeSearchQuery,
} from "@/common/lib/search"
import { isNullish } from "@/common/lib/is-nullish"

import {
  Vacancy,
  VacancyFormat,
  VacancyStatus,
  VacancyWorkExperience,
} from "./entities/vacancy.entity"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { FunnelStepsService } from "./funnel-steps.service"
import { UpdateVacancyDto } from "./dto/update-vacancy-dto"
import { GetCandidateVacanciesDto } from "./dto/get-candidate-vacancies.dto"
import { MATCH_FOR_ME_MIN_PERCENT, MATCH_PERCENT_WEIGHTS } from "./lib/matching"

type VacancyFilters = Pick<
  GetCandidateVacanciesDto,
  | "query"
  | "employmentTypes"
  | "formats"
  | "schedules"
  | "workExperiences"
  | "specializationIds"
  | "cityIds"
  | "skillIds"
  | "salaryFrom"
  | "salaryTo"
>

type VacancyWithMatchRaw = {
  match_vacancy_id?: string
  vacancy_id?: string
  match_percent?: string | number | null
}

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacanciesRepo: Repository<Vacancy>,

    private readonly dataSource: DataSource,
    private readonly funnelStepsService: FunnelStepsService,
    private readonly usersService: UsersService,
    private readonly candidatesService: CandidatesService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  private createQB(manager?: EntityManager) {
    const repo = manager?.getRepository(Vacancy) ?? this.vacanciesRepo

    return repo
      .createQueryBuilder("vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.user", "recruiterUser")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("company.logo", "logo")
      .leftJoinAndSelect("vacancy.specialization", "specialization")
      .leftJoinAndSelect("vacancy.city", "city")
      .leftJoinAndSelect("vacancy.skills", "skills")
      .orderBy("vacancy.createdAt", "DESC")
  }

  private async findOne(
    where: FindOptionsWhere<Vacancy>,
    manager?: EntityManager,
  ) {
    const qb = this.createQB(manager)
      .setFindOptions({ where })
      .leftJoinAndSelect("vacancy.funnelSteps", "funnelStep")
      .orderBy("funnelStep.index", "ASC")

    const vacancy = await qb.getOne()

    if (!vacancy) {
      throw new NotFoundException("Вакансия не найдена") // TODO: unified exception
    }

    return vacancy
  }

  private async handleFunnelStepsUpsert(
    funnelStepsDto: UpdateVacancyDto["funnelSteps"], // TODO: it's not only for updating
    vacancy: Vacancy,
    manager?: EntityManager,
  ) {
    if (!funnelStepsDto) return

    if (vacancy.funnelSteps) {
      for (const funnelStep of vacancy.funnelSteps) {
        const funnelStepExists = funnelStepsDto.some(
          (i) => i.id === funnelStep.id,
        )

        if (!funnelStepExists) {
          await this.funnelStepsService.delete(funnelStep.id, manager)
        }
      }
    }

    for (const [funnelStepIdx, funnelStepDto] of funnelStepsDto.entries()) {
      if (funnelStepDto.id) {
        await this.funnelStepsService.update(
          funnelStepDto.id,
          {
            ...funnelStepDto,
            index: funnelStepIdx,
          },
          manager,
        )
      } else {
        await this.funnelStepsService.create(
          {
            ...funnelStepDto,
            index: funnelStepIdx,
            vacancy: { id: vacancy.id },
          },
          manager,
        )
      }
    }
  }

  private applyVacancyFilters(
    qb: SelectQueryBuilder<Vacancy>,
    filters: VacancyFilters,
  ) {
    const query = normalizeSearchQuery(filters.query)

    if (query) {
      qb.andWhere(
        `${createCaseInsensitiveSearchExpression("vacancy.title")} LIKE :query`,
        {
          query: `%${query}%`,
        },
      )
    }

    if (filters.employmentTypes?.length) {
      qb.andWhere('vacancy."employmentType" IN (:...employmentTypes)', {
        employmentTypes: filters.employmentTypes,
      })
    }

    if (filters.formats?.length) {
      qb.andWhere("vacancy.format IN (:...formats)", {
        formats: filters.formats,
      })
    }

    if (filters.schedules?.length) {
      qb.andWhere("vacancy.schedule IN (:...schedules)", {
        schedules: filters.schedules,
      })
    }

    if (filters.workExperiences?.length) {
      qb.andWhere('vacancy."workExperience" IN (:...workExperiences)', {
        workExperiences: filters.workExperiences,
      })
    }

    if (filters.specializationIds?.length) {
      qb.andWhere("specialization.id IN (:...specializationIds)", {
        specializationIds: filters.specializationIds,
      })
    }

    if (filters.cityIds?.length) {
      qb.andWhere("city.id IN (:...cityIds)", {
        cityIds: filters.cityIds,
      })
    }

    if (filters.skillIds?.length) {
      qb.andWhere("skills.id IN (:...skillIds)", {
        skillIds: filters.skillIds,
      })
    }

    if (filters.salaryFrom) {
      qb.andWhere('(vacancy."salaryFrom" >= :salaryFrom)', {
        salaryFrom: filters.salaryFrom,
      })
    }

    if (filters.salaryTo) {
      qb.andWhere('(vacancy."salaryTo" <= :salaryTo)', {
        salaryTo: filters.salaryTo,
      })
    }
  }

  private getCandidateMatchPercentExpression() {
    const escape = (value: string) => this.dataSource.driver.escape(value)
    const vacancySkillsRelation =
      this.vacanciesRepo.metadata.findRelationWithPropertyPath("skills")
    const candidateSkillsRelation = this.dataSource
      .getMetadata(Candidate)
      .findRelationWithPropertyPath("skills")
    const workExperienceMetadata =
      this.dataSource.getMetadata(WorkExperienceItem)
    const workExperienceCandidateRelation =
      workExperienceMetadata.findRelationWithPropertyPath("candidate")

    if (
      !vacancySkillsRelation?.joinTableName ||
      !candidateSkillsRelation?.joinTableName ||
      !workExperienceCandidateRelation?.joinColumns[0]
    ) {
      throw new InternalServerErrorException(
        "Не удалось рассчитать совпадение с вакансией",
      )
    }

    const vacancySkillsTable = escape(vacancySkillsRelation.joinTableName)
    const vacancySkillsVacancyColumn = escape(
      vacancySkillsRelation.joinColumns[0].databaseName,
    )
    const vacancySkillsSkillColumn = escape(
      vacancySkillsRelation.inverseJoinColumns[0].databaseName,
    )

    const candidateSkillsTable = escape(candidateSkillsRelation.joinTableName)
    const candidateSkillsCandidateColumn = escape(
      candidateSkillsRelation.joinColumns[0].databaseName,
    )
    const candidateSkillsSkillColumn = escape(
      candidateSkillsRelation.inverseJoinColumns[0].databaseName,
    )
    const workExperienceTable = escape(workExperienceMetadata.tableName)
    const workExperienceCandidateColumn = escape(
      workExperienceCandidateRelation.joinColumns[0].databaseName,
    )
    const workExperienceStartedAtColumn = escape(
      workExperienceMetadata.findColumnWithPropertyName("startedAt")!
        .databaseName,
    )
    const workExperienceEndedAtColumn = escape(
      workExperienceMetadata.findColumnWithPropertyName("endedAt")!
        .databaseName,
    )

    const requiredSkillsCountExpression = `
      (
        SELECT COUNT(*)::numeric
        FROM ${vacancySkillsTable} "vacancySkillCount"
        WHERE "vacancySkillCount".${vacancySkillsVacancyColumn} = vacancy.id
      )
    `

    const matchedSkillsCountExpression = `
      (
        SELECT COUNT(*)::numeric
        FROM ${vacancySkillsTable} "vacancySkillMatch"
        INNER JOIN ${candidateSkillsTable} "candidateSkillMatch"
          ON "candidateSkillMatch".${candidateSkillsSkillColumn} = "vacancySkillMatch".${vacancySkillsSkillColumn}
          AND "candidateSkillMatch".${candidateSkillsCandidateColumn} = :candidateId
        WHERE "vacancySkillMatch".${vacancySkillsVacancyColumn} = vacancy.id
      )
    `

    const skillsScoreExpression = `
      CASE
        WHEN ${requiredSkillsCountExpression} > 0
        THEN LEAST(
          ${MATCH_PERCENT_WEIGHTS.skills},
          ${matchedSkillsCountExpression} * ${MATCH_PERCENT_WEIGHTS.skills}.0 / ${requiredSkillsCountExpression}
        )
        ELSE ${MATCH_PERCENT_WEIGHTS.skills}
      END
    `

    const candidateSpecializationIdExpression =
      "CAST(:candidateSpecializationId AS uuid)"
    const candidateSalaryFromExpression =
      "CAST(:candidateSalaryFrom AS numeric)"
    const candidateSalaryToExpression = "CAST(:candidateSalaryTo AS numeric)"
    const candidateFormatExpression = "CAST(:candidateFormat AS text)"
    const candidateCityIdExpression = "CAST(:candidateCityId AS uuid)"
    const candidateEmploymentTypeExpression =
      "CAST(:candidateEmploymentType AS text)"
    const candidateScheduleExpression = "CAST(:candidateSchedule AS text)"

    const specializationScoreExpression = `
      CASE
        WHEN specialization.id IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.specialization}
        WHEN ${candidateSpecializationIdExpression} IS NOT NULL AND specialization.id = ${candidateSpecializationIdExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.specialization}
        ELSE 0
      END
    `

    const candidateExperienceMonthsExpression = `
      (
        SELECT COALESCE(
          SUM(
            GREATEST(
              0,
              DATE_PART(
                'year',
                AGE(
                  COALESCE("workExperienceMatch".${workExperienceEndedAtColumn}, NOW()),
                  "workExperienceMatch".${workExperienceStartedAtColumn}
                )
              ) * 12
              + DATE_PART(
                'month',
                AGE(
                  COALESCE("workExperienceMatch".${workExperienceEndedAtColumn}, NOW()),
                  "workExperienceMatch".${workExperienceStartedAtColumn}
                )
              )
            )
          ),
          0
        )
        FROM ${workExperienceTable} "workExperienceMatch"
        WHERE "workExperienceMatch".${workExperienceCandidateColumn} = :candidateId
      )
    `

    const experienceScoreExpression = `
      CASE
        WHEN vacancy."workExperience" IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN vacancy."workExperience" = '${VacancyWorkExperience.None}' AND ${candidateExperienceMonthsExpression} >= 0
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN vacancy."workExperience" = '${VacancyWorkExperience.UpToYear}' AND ${candidateExperienceMonthsExpression} > 0
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN vacancy."workExperience" = '${VacancyWorkExperience.OneToThreeYears}' AND ${candidateExperienceMonthsExpression} >= 12
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN vacancy."workExperience" = '${VacancyWorkExperience.ThreeToFiveYears}' AND ${candidateExperienceMonthsExpression} >= 36
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN vacancy."workExperience" = '${VacancyWorkExperience.FromFiveYears}' AND ${candidateExperienceMonthsExpression} >= 60
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        ELSE 0
      END
    `

    const salaryScoreExpression = `
      CASE
        WHEN vacancy."salaryFrom" IS NULL AND vacancy."salaryTo" IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.salary}
        WHEN (vacancy."salaryTo" IS NULL OR COALESCE(${candidateSalaryFromExpression}, 0) <= vacancy."salaryTo")
          AND (vacancy."salaryFrom" IS NULL OR COALESCE(${candidateSalaryToExpression}, 999999999999) >= vacancy."salaryFrom")
        THEN ${MATCH_PERCENT_WEIGHTS.salary}
        ELSE 0
      END
    `

    const formatScoreExpression = `
      CASE
        WHEN vacancy.format IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.format}
        WHEN ${candidateFormatExpression} IS NOT NULL AND vacancy.format::text = ${candidateFormatExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.format}
        ELSE 0
      END
    `

    const cityScoreExpression = `
      CASE
        WHEN vacancy.format = '${VacancyFormat.Remote}' OR city.id IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.city}
        WHEN ${candidateCityIdExpression} IS NOT NULL AND city.id = ${candidateCityIdExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.city}
        ELSE 0
      END
    `

    const employmentTypeScoreExpression = `
      CASE
        WHEN vacancy."employmentType" IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.employmentType}
        WHEN ${candidateEmploymentTypeExpression} IS NOT NULL AND vacancy."employmentType"::text = ${candidateEmploymentTypeExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.employmentType}
        ELSE 0
      END
    `

    const scheduleScoreExpression = `
      CASE
        WHEN vacancy.schedule IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.schedule}
        WHEN ${candidateScheduleExpression} IS NOT NULL AND vacancy.schedule::text = ${candidateScheduleExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.schedule}
        ELSE 0
      END
    `

    return `
      ROUND(
        ${skillsScoreExpression}
        + ${specializationScoreExpression}
        + ${experienceScoreExpression}
        + ${salaryScoreExpression}
        + ${formatScoreExpression}
        + ${cityScoreExpression}
        + ${employmentTypeScoreExpression}
        + ${scheduleScoreExpression}
      )::int
    `
  }

  private applyCandidateMatchPercent(
    qb: SelectQueryBuilder<Vacancy>,
    user: Awaited<ReturnType<UsersService["findFilledCandidateById"]>>,
    options?: { filterByMatch?: boolean },
  ) {
    const matchPercentExpression = this.getCandidateMatchPercentExpression()

    qb.addSelect(matchPercentExpression, "match_percent").setParameters({
      candidateId: user.candidate.id,
      candidateCityId: user.candidate.city?.id ?? null,
      candidateSpecializationId: user.candidate.specialization?.id ?? null,
      candidateSalaryFrom: user.candidate.salaryFrom,
      candidateSalaryTo: user.candidate.salaryTo,
      candidateFormat: user.candidate.format,
      candidateEmploymentType: user.candidate.employmentType,
      candidateSchedule: user.candidate.schedule,
    })

    if (options?.filterByMatch) {
      qb.andWhere(`${matchPercentExpression} >= :minMatchPercent`, {
        minMatchPercent: MATCH_FOR_ME_MIN_PERCENT,
      })
      qb.orderBy(matchPercentExpression, "DESC").addOrderBy(
        "vacancy.createdAt",
        "DESC",
      )
    }
  }

  private applyMatchPercentToVacancies(
    vacancies: Vacancy[],
    rawVacancies: VacancyWithMatchRaw[],
  ) {
    const matchPercentByVacancyId = new Map<string, number>()

    for (const rawVacancy of rawVacancies) {
      const vacancyId = rawVacancy.match_vacancy_id ?? rawVacancy.vacancy_id

      if (!vacancyId || matchPercentByVacancyId.has(vacancyId)) {
        continue
      }

      matchPercentByVacancyId.set(
        vacancyId,
        Number(rawVacancy.match_percent ?? 0),
      )
    }

    return vacancies.map((vacancy) => {
      vacancy.matchPercent = matchPercentByVacancyId.get(vacancy.id) ?? 0
      return vacancy
    })
  }

  findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, manager)
  }

  async findOneForCurrentUser(id: string, user_: ICurrentUser) {
    const vacancy = await this.findOneById(id)

    if (user_.role === UserRole.Candidate) {
      if (vacancy.status === VacancyStatus.Archived) {
        throw new NotFoundException("Вакансия не найдена")
      }

      return vacancy
    }

    if (user_.role === UserRole.Recruiter) {
      const user = await this.usersService.findFilledRecruiterById(user_.id)

      if (vacancy.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException("Вы не являетесь автором этой вакансии")
      }

      return vacancy
    }

    throw new ForbiddenException("Вы не можете просматривать эту вакансию")
  }

  async findMatchedCandidates(id: string, user_: ICurrentUser) {
    const vacancy = await this.findOneById(id)
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    if (vacancy.recruiter?.id !== user.recruiter.id) {
      throw new ForbiddenException("Вы не являетесь автором этой вакансии")
    }

    return this.candidatesService.findMatchedForVacancy(vacancy)
  }

  async findAllForRecruiter(
    dto: GetRecruiterVacanciesDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.createQB().andWhere("recruiter.id = :recruiterId", {
      recruiterId: user.recruiter.id,
    })

    this.applyVacancyFilters(qb, { query: dto.query })

    if (dto.status) {
      qb.andWhere("vacancy.status = :status", { status: dto.status })
    }

    return qb.getMany()
  }

  async findAllForCandidate(
    dto: GetCandidateVacanciesDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledCandidateById(user_.id)

    const qb = this.createQB().andWhere("vacancy.status = :status", {
      status: VacancyStatus.Active,
    })

    this.applyVacancyFilters(qb, dto.matchForMe ? { query: dto.query } : dto)
    this.applyCandidateMatchPercent(qb, user, {
      filterByMatch: dto.matchForMe,
    })

    const { entities, raw } = await qb.getRawAndEntities()

    return this.applyMatchPercentToVacancies(
      entities,
      raw as VacancyWithMatchRaw[],
    )
  }

  async create(dto_: CreateVacancyDto, user_: ICurrentUser) {
    const { funnelSteps: funnelStepsDto, ...dto } = dto_

    const vacancyId = await this.dataSource.transaction(async (manager) => {
      const vacanciesRepo = manager.getRepository(Vacancy)

      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      let vacancy = vacanciesRepo.create({
        ...dto,
        specialization: { id: dto.specializationId },
        city: isNullish(dto.cityId) ? dto.cityId : { id: dto.cityId },
        skills: isNullish(dto.skillIds)
          ? dto.skillIds
          : dto.skillIds.map((id) => ({ id })),
        recruiter: { id: user.recruiter.id },
      })

      vacancy = await vacanciesRepo.save(vacancy)

      await this.handleFunnelStepsUpsert(funnelStepsDto, vacancy, manager)

      return vacancy.id
    })

    return this.findOneById(vacancyId)
  }

  private async updateStatus(
    id: string,
    status: VacancyStatus,
    user_: ICurrentUser,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const vacancy = await this.findOneById(id, manager)
      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      if (vacancy.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException("Вы не являетесь автором этой вакансии")
      }

      if (vacancy.status === status) return

      if (status === VacancyStatus.Archived) {
        await this.applicationsService.rejectPendingForArchivedVacancy(
          vacancy,
          manager,
        )
      }

      await manager.getRepository(Vacancy).save({
        id,
        status,
      })
    })

    return this.findOneById(id)
  }

  archive(id: string, user: ICurrentUser) {
    return this.updateStatus(id, VacancyStatus.Archived, user)
  }

  restore(id: string, user: ICurrentUser) {
    return this.updateStatus(id, VacancyStatus.Active, user)
  }

  async update(id: string, dto_: UpdateVacancyDto, user_: ICurrentUser) {
    const {
      skillIds,
      specializationId,
      cityId,
      funnelSteps: funnelStepsDto,
      ...dto
    } = dto_

    await this.dataSource.transaction(async (manager) => {
      const vacancy = await this.findOneById(id, manager)
      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      if (vacancy.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException("Вы не являетесь автором этой вакансии")
      }

      const vacanciesRepo = manager.getRepository(Vacancy)

      const updatedVacancy = vacanciesRepo.create({
        ...dto,
        id,
        specialization: isNullish(specializationId)
          ? specializationId
          : { id: specializationId },
        city: isNullish(cityId) ? cityId : { id: cityId },
        skills: isNullish(skillIds) ? skillIds : skillIds.map((id) => ({ id })),
      })

      await vacanciesRepo.save(updatedVacancy)

      await this.handleFunnelStepsUpsert(funnelStepsDto, vacancy, manager)
    })

    return this.findOneById(id)
  }
}
