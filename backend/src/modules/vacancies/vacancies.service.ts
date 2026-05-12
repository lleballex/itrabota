import {
  ConflictException,
  ForbiddenException,
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
import { UserRole } from "@/modules/users/types/user-role"
import { ApplicationsService } from "@/modules/applications/applications.service"
import { CandidatesService } from "@/modules/users/candidates.service"
import { applyTokenizedCaseInsensitiveSearch } from "@/common/lib/search"
import { isNullish } from "@/common/lib/is-nullish"

import { Vacancy, VacancyStatus } from "./entities/vacancy.entity"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { FunnelStepsService } from "./funnel-steps.service"
import { UpdateVacancyDto } from "./dto/update-vacancy-dto"
import { GetCandidateVacanciesDto } from "./dto/get-candidate-vacancies.dto"
import { MATCH_FOR_ME_MIN_PERCENT } from "./lib/matching"
import { calculateMatchPercent } from "./lib/calculate-match-percent"

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
    applyTokenizedCaseInsensitiveSearch(
      qb,
      filters.query,
      [
        "vacancy.title",
        "company.name",
        "skills.name",
        "industry.name",
        "specialization.name",
        "city.name",
        "vacancy.description",
        "vacancy.requirements",
        "vacancy.niceToHave",
        "vacancy.responsibilities",
        "vacancy.conditions",
      ],
      "vacancySearch",
    )

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

  private hasMatchingSkills(vacancy: Vacancy, skillIds: string[] | undefined) {
    if (!skillIds?.length) {
      return true
    }

    const vacancySkillIds = new Set(
      vacancy.skills?.map((skill) => skill.id) ?? [],
    )

    return skillIds.some((skillId) => vacancySkillIds.has(skillId))
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
      const user = await this.usersService.findFilledRecruiterRefById(user_.id)

      if (vacancy.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException("Вы не являетесь автором этой вакансии")
      }

      return vacancy
    }

    throw new ForbiddenException("Вы не можете просматривать эту вакансию")
  }

  async findMatchedCandidates(id: string, user_: ICurrentUser) {
    const vacancy = await this.findOneById(id)
    const user = await this.usersService.findFilledRecruiterRefById(user_.id)

    if (vacancy.recruiter?.id !== user.recruiter.id) {
      throw new ForbiddenException("Вы не являетесь автором этой вакансии")
    }

    return this.candidatesService.findMatchedForVacancy(vacancy)
  }

  async findAllForRecruiter(
    dto: GetRecruiterVacanciesDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterRefById(user_.id)

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

    const vacancies = await qb.getMany()
    const filteredVacancies = vacancies.filter((vacancy) =>
      this.hasMatchingSkills(
        vacancy,
        dto.matchForMe ? undefined : dto.skillIds,
      ),
    )

    for (const vacancy of filteredVacancies) {
      vacancy.matchPercent = calculateMatchPercent(vacancy, user.candidate)
    }

    if (!dto.matchForMe) {
      return filteredVacancies
    }

    return filteredVacancies
      .filter(
        (vacancy) => (vacancy.matchPercent ?? 0) >= MATCH_FOR_ME_MIN_PERCENT,
      )
      .sort((left, right) => {
        const diff = (right.matchPercent ?? 0) - (left.matchPercent ?? 0)

        if (diff !== 0) {
          return diff
        }

        return right.createdAt.getTime() - left.createdAt.getTime()
      })
  }

  async create(dto_: CreateVacancyDto, user_: ICurrentUser) {
    const { funnelSteps: funnelStepsDto, ...dto } = dto_

    const vacancyId = await this.dataSource.transaction(async (manager) => {
      const vacanciesRepo = manager.getRepository(Vacancy)

      const user = await this.usersService.findFilledRecruiterRefById(
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
      const user = await this.usersService.findFilledRecruiterRefById(
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
      const user = await this.usersService.findFilledRecruiterRefById(
        user_.id,
        manager,
      )

      if (vacancy.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException("Вы не являетесь автором этой вакансии")
      }

      const vacanciesRepo = manager.getRepository(Vacancy)

      if (funnelStepsDto) {
        const hasApplications = await this.applicationsService.hasForVacancy(
          id,
          manager,
        )

        if (hasApplications) {
          throw new ConflictException(
            "Нельзя редактировать воронку вакансии, по которой уже есть отклики",
          )
        }
      }

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
