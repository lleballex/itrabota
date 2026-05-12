import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { applyTokenizedCaseInsensitiveSearch } from "@/common/lib/search"

import { UsersService } from "./users.service"
import { Candidate } from "./entities/candidate.entity"
import { ICandidatesSearchParams } from "./interfaces/candidates-service.interface"
import { calculateTotalWorkExperienceMonths } from "./lib/calculate-total-work-experience-months"
import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { MATCH_FOR_ME_MIN_PERCENT } from "@/modules/vacancies/lib/matching"
import { calculateMatchPercent } from "@/modules/vacancies/lib/calculate-match-percent"

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidatesRepo: Repository<Candidate>,
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
      .leftJoinAndSelect("candidate.projects", "candidateProjectItem")
      .leftJoinAndSelect(
        "candidateProjectItem.skills",
        "candidateProjectSkills",
      )
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

    if (params?.projectsCountMin !== undefined) {
      qb.andWhere(
        `(
          SELECT COUNT(*)
          FROM "candidate_project_item" "candidateProjectCount"
          WHERE "candidateProjectCount"."candidateId" = candidate.id
        ) >= :projectsCountMin`,
        {
          projectsCountMin: params.projectsCountMin,
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

  private hasMatchingSkills(
    candidate: Candidate,
    skillIds: string[] | undefined,
  ) {
    if (!skillIds?.length) {
      return true
    }

    const candidateSkillIds = new Set(
      candidate.skills?.map((skill) => skill.id) ?? [],
    )

    return skillIds.some((skillId) => candidateSkillIds.has(skillId))
  }

  private enrichCandidates(candidates: Candidate[]) {
    for (const candidate of candidates) {
      this.attachTotalWorkExperienceMonths(candidate)
    }

    return candidates
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

    this.enrichCandidates([candidate])

    return candidate
  }

  async findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, manager)
  }

  async findAllForRecruiter(
    user_: ICurrentUser,
    params?: ICandidatesSearchParams,
  ) {
    await this.usersService.findFilledRecruiterRefById(user_.id)

    const qb = this.createQB(params).andWhere("candidate.isHidden = false")
    const candidates = this.enrichCandidates(await qb.getMany())

    return candidates.filter((candidate) =>
      this.hasMatchingSkills(candidate, params?.skillIds),
    )
  }

  async findMatchedForVacancy(vacancy: Vacancy) {
    const qb = this.createQB().andWhere("candidate.isHidden = false")
    const candidates = this.enrichCandidates(await qb.getMany())

    for (const candidate of candidates) {
      candidate.matchPercent = calculateMatchPercent(vacancy, candidate)
    }

    return candidates
      .filter(
        (candidate) =>
          (candidate.matchPercent ?? 0) >= MATCH_FOR_ME_MIN_PERCENT,
      )
      .sort((left, right) => {
        const diff = (right.matchPercent ?? 0) - (left.matchPercent ?? 0)

        if (diff !== 0) {
          return diff
        }

        return right.createdAt.getTime() - left.createdAt.getTime()
      })
  }

  async findOneForRecruiterById(id: string, user_: ICurrentUser) {
    await this.usersService.findFilledRecruiterRefById(user_.id)

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
