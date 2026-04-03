import {
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
} from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"

import { Vacancy, VacancyStatus } from "./entities/vacancy.entity"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { FunnelStepsService } from "./funnel-steps.service"
import { UpdateVacancyDto } from "./dto/update-vacancy-dto"
import { GetCandidateVacanciesDto } from "./dto/get-candidate-vacancies.dto"
import { isNullish } from "@/common/lib/is-nullish"

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacanciesRepo: Repository<Vacancy>,

    private readonly dataSource: DataSource,
    private readonly funnelStepsService: FunnelStepsService,
    private readonly usersService: UsersService,
  ) {}

  private createQB(manager?: EntityManager) {
    const repo = manager?.getRepository(Vacancy) ?? this.vacanciesRepo

    return repo
      .createQueryBuilder("vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
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
      throw new NotFoundException("Vacancy not found") // TODO: unified exception
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

  findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, manager)
  }

  async findAllForRecruiter(
    dto: GetRecruiterVacanciesDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.createQB().andWhere("recruiter.id = :recruiterId", {
      recruiterId: user.recruiter.id,
    })

    if (dto.query) {
      qb.andWhere("vacancy.title ILIKE :query", { query: `%${dto.query}%` })
    }

    if (dto.status) {
      qb.andWhere("vacancy.status = :status", { status: dto.status })
    }

    return qb.getMany()
  }

  async findAllForCandidate(
    dto: GetCandidateVacanciesDto,
    user_: ICurrentUser,
  ) {
    await this.usersService.findFilledCandidateById(user_.id)

    const qb = this.createQB().andWhere("vacancy.status = :status", {
      status: VacancyStatus.Active,
    })

    if (dto.query) {
      qb.andWhere("vacancy.title ILIKE :query", { query: `%${dto.query}%` })
    }

    return qb.getMany()
  }

  async create(dto_: CreateVacancyDto, user_: ICurrentUser) {
    const { funnelSteps: funnelStepsDto, ...dto } = dto_

    const user = await this.usersService.findFilledRecruiterById(user_.id)

    // TODO: start transaction

    let vacancy = this.vacanciesRepo.create({
      ...dto,
      specialization: { id: dto.specializationId },
      city: dto.cityId ? { id: dto.cityId } : null,
      skills: dto.skillIds?.map((id) => ({ id })),
      recruiter: { id: user.recruiter.id },
    })

    vacancy = await this.vacanciesRepo.save(vacancy)

    await this.handleFunnelStepsUpsert(funnelStepsDto, vacancy)

    return this.findOneById(vacancy.id)
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
        throw new ForbiddenException("You are not the author of the vacancy")
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
