import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { applyTokenizedCaseInsensitiveSearch } from "@/common/lib/search"

import { UsersService } from "./users.service"
import { Candidate } from "./entities/candidate.entity"
import { ICandidatesSearchParams } from "./interfaces/candidates-service.interface"
import { calculateTotalWorkExperienceMonths } from "./lib/calculate-total-work-experience-months"
import {
  Vacancy,
  VacancyFormat,
  VacancyWorkExperience,
} from "@/modules/vacancies/entities/vacancy.entity"
import { WorkExperienceItem } from "./entities/work-experence-item.entity"
import {
  MATCH_FOR_ME_MIN_PERCENT,
  MATCH_PERCENT_WEIGHTS,
} from "@/modules/vacancies/lib/matching"

type CandidateWithMatchRaw = {
  match_candidate_id?: string
  candidate_id?: string
  match_percent?: string | number | null
}

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidatesRepo: Repository<Candidate>,
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {}

  private createQB(params?: ICandidatesSearchParams, manager?: EntityManager) {
    const repo = manager?.getRepository(Candidate) ?? this.candidatesRepo

    const qb = repo
      .createQueryBuilder("candidate")
      .leftJoinAndSelect("candidate.user", "user")
      .leftJoinAndSelect("candidate.city", "city")
      .leftJoinAndSelect("candidate.specialization", "specialization")
      .leftJoinAndSelect("candidate.avatar", "avatar")
      .leftJoinAndSelect("candidate.skills", "skills")
      .leftJoinAndSelect("candidate.workExperience", "workExperienceItem")
      .orderBy("candidate.createdAt", "DESC")

    applyTokenizedCaseInsensitiveSearch(
      qb,
      params?.query,
      [
        "candidate.firstName",
        "candidate.lastName",
        "candidate.patronymic",
        "concat_ws(' ', candidate.lastName, candidate.firstName, candidate.patronymic)",
        "concat_ws(' ', candidate.firstName, candidate.lastName, candidate.patronymic)",
        "city.name",
        "skills.name",
        "specialization.name",
        "user.email",
        "candidate.phoneNumber",
        "candidate.tgUsername",
      ],
      "candidateSearch",
    )

    if (params?.employmentTypes?.length) {
      qb.andWhere('candidate."employmentType" IN (:...employmentTypes)', {
        employmentTypes: params.employmentTypes,
      })
    }

    if (params?.formats?.length) {
      qb.andWhere("candidate.format IN (:...formats)", {
        formats: params.formats,
      })
    }

    if (params?.schedules?.length) {
      qb.andWhere("candidate.schedule IN (:...schedules)", {
        schedules: params.schedules,
      })
    }

    if (params?.specializationIds?.length) {
      qb.andWhere("specialization.id IN (:...specializationIds)", {
        specializationIds: params.specializationIds,
      })
    }

    if (params?.cityIds?.length) {
      qb.andWhere("city.id IN (:...cityIds)", {
        cityIds: params.cityIds,
      })
    }

    if (params?.skillIds?.length) {
      qb.andWhere("skills.id IN (:...skillIds)", {
        skillIds: params.skillIds,
      })
    }

    if (params?.salaryFrom) {
      qb.andWhere(
        '(candidate."salaryFrom" IS NULL OR candidate."salaryFrom" >= :salaryFrom)',
        {
          salaryFrom: params.salaryFrom,
        },
      )
    }

    if (params?.salaryTo) {
      qb.andWhere(
        '(candidate."salaryTo" IS NULL OR candidate."salaryTo" <= :salaryTo)',
        {
          salaryTo: params.salaryTo,
        },
      )
    }

    if (params?.ageFrom !== undefined) {
      qb.andWhere("date_part('year', age(candidate.\"bornAt\")) >= :ageFrom", {
        ageFrom: params.ageFrom,
      })
    }

    if (params?.ageTo !== undefined) {
      qb.andWhere("date_part('year', age(candidate.\"bornAt\")) <= :ageTo", {
        ageTo: params.ageTo,
      })
    }

    if (params?.totalWorkExperienceMonthsMin !== undefined) {
      qb.andWhere(
        `COALESCE((
          SELECT SUM(GREATEST(
            (
              date_part('year', age(COALESCE("workExperience"."endedAt", now()), "workExperience"."startedAt")) * 12
              + date_part('month', age(COALESCE("workExperience"."endedAt", now()), "workExperience"."startedAt"))
            )::int,
            0
          ))
          FROM "work_experience_item" "workExperience"
          WHERE "workExperience"."candidateId" = candidate.id
        ), 0) >= :totalWorkExperienceMonthsMin`,
        {
          totalWorkExperienceMonthsMin: params.totalWorkExperienceMonthsMin,
        },
      )
    }

    return qb
  }

  private attachTotalWorkExperienceMonths<T extends Candidate>(candidate: T) {
    candidate.totalWorkExperienceMonths = calculateTotalWorkExperienceMonths(
      candidate.workExperience,
    )

    return candidate
  }

  private getVacancyMatchPercentExpression() {
    const escape = (value: string) => this.dataSource.driver.escape(value)
    const candidateSkillsRelation =
      this.candidatesRepo.metadata.findRelationWithPropertyPath("skills")
    const vacancySkillsRelation = this.dataSource
      .getMetadata(Vacancy)
      .findRelationWithPropertyPath("skills")
    const workExperienceMetadata =
      this.dataSource.getMetadata(WorkExperienceItem)
    const workExperienceCandidateRelation =
      workExperienceMetadata.findRelationWithPropertyPath("candidate")

    if (
      !candidateSkillsRelation?.joinTableName ||
      !vacancySkillsRelation?.joinTableName ||
      !workExperienceCandidateRelation?.joinColumns[0]
    ) {
      throw new InternalServerErrorException(
        "Не удалось рассчитать совпадение с кандидатом",
      )
    }

    const candidateSkillsTable = escape(candidateSkillsRelation.joinTableName)
    const candidateSkillsCandidateColumn = escape(
      candidateSkillsRelation.joinColumns[0].databaseName,
    )
    const candidateSkillsSkillColumn = escape(
      candidateSkillsRelation.inverseJoinColumns[0].databaseName,
    )

    const vacancySkillsTable = escape(vacancySkillsRelation.joinTableName)
    const vacancySkillsVacancyColumn = escape(
      vacancySkillsRelation.joinColumns[0].databaseName,
    )
    const vacancySkillsSkillColumn = escape(
      vacancySkillsRelation.inverseJoinColumns[0].databaseName,
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
        WHERE "vacancySkillCount".${vacancySkillsVacancyColumn} = :vacancyId
      )
    `

    const matchedSkillsCountExpression = `
      (
        SELECT COUNT(*)::numeric
        FROM ${candidateSkillsTable} "candidateSkillMatch"
        INNER JOIN ${vacancySkillsTable} "vacancySkillMatch"
          ON "vacancySkillMatch".${vacancySkillsSkillColumn} = "candidateSkillMatch".${candidateSkillsSkillColumn}
          AND "vacancySkillMatch".${vacancySkillsVacancyColumn} = :vacancyId
        WHERE "candidateSkillMatch".${candidateSkillsCandidateColumn} = candidate.id
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

    const vacancySpecializationIdExpression =
      "CAST(:vacancySpecializationId AS uuid)"
    const vacancySalaryFromExpression = "CAST(:vacancySalaryFrom AS numeric)"
    const vacancySalaryToExpression = "CAST(:vacancySalaryTo AS numeric)"
    const vacancyFormatExpression = "CAST(:vacancyFormat AS text)"
    const vacancyCityIdExpression = "CAST(:vacancyCityId AS uuid)"
    const vacancyEmploymentTypeExpression =
      "CAST(:vacancyEmploymentType AS text)"
    const vacancyScheduleExpression = "CAST(:vacancySchedule AS text)"
    const vacancyWorkExperienceExpression =
      "CAST(:vacancyWorkExperience AS text)"

    const specializationScoreExpression = `
      CASE
        WHEN ${vacancySpecializationIdExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.specialization}
        WHEN specialization.id IS NOT NULL AND specialization.id = ${vacancySpecializationIdExpression}
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
        WHERE "workExperienceMatch".${workExperienceCandidateColumn} = candidate.id
      )
    `

    const experienceScoreExpression = `
      CASE
        WHEN ${vacancyWorkExperienceExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN ${vacancyWorkExperienceExpression} = '${VacancyWorkExperience.None}' AND ${candidateExperienceMonthsExpression} >= 0
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN ${vacancyWorkExperienceExpression} = '${VacancyWorkExperience.UpToYear}' AND ${candidateExperienceMonthsExpression} > 0
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN ${vacancyWorkExperienceExpression} = '${VacancyWorkExperience.OneToThreeYears}' AND ${candidateExperienceMonthsExpression} >= 12
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN ${vacancyWorkExperienceExpression} = '${VacancyWorkExperience.ThreeToFiveYears}' AND ${candidateExperienceMonthsExpression} >= 36
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        WHEN ${vacancyWorkExperienceExpression} = '${VacancyWorkExperience.FromFiveYears}' AND ${candidateExperienceMonthsExpression} >= 60
        THEN ${MATCH_PERCENT_WEIGHTS.experience}
        ELSE 0
      END
    `

    const salaryScoreExpression = `
      CASE
        WHEN ${vacancySalaryFromExpression} IS NULL AND ${vacancySalaryToExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.salary}
        WHEN (${vacancySalaryToExpression} IS NULL OR COALESCE(candidate."salaryFrom", 0) <= ${vacancySalaryToExpression})
          AND (${vacancySalaryFromExpression} IS NULL OR COALESCE(candidate."salaryTo", 999999999999) >= ${vacancySalaryFromExpression})
        THEN ${MATCH_PERCENT_WEIGHTS.salary}
        ELSE 0
      END
    `

    const formatScoreExpression = `
      CASE
        WHEN ${vacancyFormatExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.format}
        WHEN candidate.format IS NOT NULL AND candidate.format::text = ${vacancyFormatExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.format}
        ELSE 0
      END
    `

    const cityScoreExpression = `
      CASE
        WHEN ${vacancyFormatExpression} = '${VacancyFormat.Remote}' OR ${vacancyCityIdExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.city}
        WHEN city.id IS NOT NULL AND city.id = ${vacancyCityIdExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.city}
        ELSE 0
      END
    `

    const employmentTypeScoreExpression = `
      CASE
        WHEN ${vacancyEmploymentTypeExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.employmentType}
        WHEN candidate."employmentType" IS NOT NULL AND candidate."employmentType"::text = ${vacancyEmploymentTypeExpression}
        THEN ${MATCH_PERCENT_WEIGHTS.employmentType}
        ELSE 0
      END
    `

    const scheduleScoreExpression = `
      CASE
        WHEN ${vacancyScheduleExpression} IS NULL
        THEN ${MATCH_PERCENT_WEIGHTS.schedule}
        WHEN candidate.schedule IS NOT NULL AND candidate.schedule::text = ${vacancyScheduleExpression}
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

  private applyVacancyMatchPercent(
    qb: SelectQueryBuilder<Candidate>,
    vacancy: Vacancy,
  ) {
    const matchPercentExpression = this.getVacancyMatchPercentExpression()

    qb.addSelect(matchPercentExpression, "match_percent")
      .setParameters({
        vacancyId: vacancy.id,
        vacancyCityId: vacancy.city?.id ?? null,
        vacancySpecializationId: vacancy.specialization?.id ?? null,
        vacancySalaryFrom: vacancy.salaryFrom,
        vacancySalaryTo: vacancy.salaryTo,
        vacancyFormat: vacancy.format,
        vacancyEmploymentType: vacancy.employmentType,
        vacancySchedule: vacancy.schedule,
        vacancyWorkExperience: vacancy.workExperience,
        minMatchPercent: MATCH_FOR_ME_MIN_PERCENT,
      })
      .andWhere(`${matchPercentExpression} >= :minMatchPercent`)
      .orderBy(matchPercentExpression, "DESC")
      .addOrderBy("candidate.createdAt", "DESC")
  }

  private applyMatchPercentToCandidates(
    candidates: Candidate[],
    rawCandidates: CandidateWithMatchRaw[],
  ) {
    const matchPercentByCandidateId = new Map<string, number>()

    for (const rawCandidate of rawCandidates) {
      const candidateId =
        rawCandidate.match_candidate_id ?? rawCandidate.candidate_id

      if (!candidateId || matchPercentByCandidateId.has(candidateId)) {
        continue
      }

      matchPercentByCandidateId.set(
        candidateId,
        Number(rawCandidate.match_percent ?? 0),
      )
    }

    return candidates.map((candidate) => {
      candidate.matchPercent = matchPercentByCandidateId.get(candidate.id) ?? 0
      return candidate
    })
  }

  private async findOne(
    where: FindOptionsWhere<Candidate>,
    manager?: EntityManager,
  ) {
    const qb = this.createQB(undefined, manager).setFindOptions({ where })

    const candidate = await qb.getOne()

    if (!candidate) {
      throw new NotFoundException("Кандидат не найден") // TODO: unified exception
    }

    return this.attachTotalWorkExperienceMonths(candidate)
  }

  async findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, manager)
  }

  async findAllForRecruiter(
    user_: ICurrentUser,
    params?: ICandidatesSearchParams,
  ) {
    await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.createQB(params).andWhere("candidate.isHidden = false")

    const candidates = await qb.getMany()

    return candidates.map((candidate) =>
      this.attachTotalWorkExperienceMonths(candidate),
    )
  }

  async findMatchedForVacancy(vacancy: Vacancy) {
    const qb = this.createQB()

    qb.andWhere("candidate.isHidden = false")

    this.applyVacancyMatchPercent(qb, vacancy)

    const { entities, raw } = await qb.getRawAndEntities()

    return this.applyMatchPercentToCandidates(
      entities,
      raw as CandidateWithMatchRaw[],
    ).map((candidate) => this.attachTotalWorkExperienceMonths(candidate))
  }

  async findOneForRecruiterById(id: string, user_: ICurrentUser) {
    await this.usersService.findFilledRecruiterById(user_.id)

    return this.findOne({ id, isHidden: false })
  }

  async create(data: DeepPartial<Candidate>, manager?: EntityManager) {
    const repo = manager?.getRepository(Candidate) ?? this.candidatesRepo

    const candidate = repo.create(data)
    const savedCandidate = await repo.save(candidate)

    return this.findOneById(savedCandidate.id, manager)
  }

  async update(
    id: string,
    data: DeepPartial<Candidate>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Candidate) ?? this.candidatesRepo
    const candidate = repo.create({ ...data, id })

    await repo.save(candidate)
    return this.findOneById(id, manager)
  }
}
