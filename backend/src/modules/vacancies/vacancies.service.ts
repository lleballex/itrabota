import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"

import { Vacancy } from "./entities/vacancy.entity"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { FunnelStepsService } from "./funnel-steps.service"

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacanciesRepo: Repository<Vacancy>,

    private readonly funnelStepsService: FunnelStepsService,
    private readonly usersService: UsersService,
  ) {}

  private createQB() {
    return this.vacanciesRepo
      .createQueryBuilder("vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("company.logo", "logo")
      .leftJoinAndSelect("vacancy.specialization", "specialization")
      .leftJoinAndSelect("vacancy.city", "city")
  }

  private async findOne(where: FindOptionsWhere<Vacancy>) {
    const qb = this.createQB()
      .setFindOptions({ where })
      .leftJoinAndSelect("vacancy.funnelSteps", "funnelStep")

    const vacancy = await qb.getOne()

    if (!vacancy) {
      throw new NotFoundException("Vacancy not found") // TODO: unified exception
    }

    return vacancy
  }

  findOneById(id: string) {
    return this.findOne({ id })
  }

  async findAllForRecruiter(
    dto: GetRecruiterVacanciesDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.createQB()
      .andWhere("recruiter.id = :recruiterId", {
        recruiterId: user.recruiter.id,
      })
      .orderBy("vacancy.createdAt", "DESC")

    if (dto.query) {
      qb.andWhere("vacancy.title ILIKE :query", { query: `%${dto.query}%` })
    }

    if (dto.status) {
      qb.andWhere("vacancy.status = :status", { status: dto.status })
    }

    return qb.getMany()
  }

  async create(dto_: CreateVacancyDto, user_: ICurrentUser) {
    const { funnelSteps: funnelStepsDto, ...dto } = dto_

    const user = await this.usersService.findFilledRecruiterById(user_.id)

    // TODO: start transaction

    const vacancy = this.vacanciesRepo.create({
      ...dto,
      specialization: { id: dto.specializationId },
      city: dto.cityId ? { id: dto.cityId } : null,
      skills: dto.skillIds?.map((id) => ({ id })),
      recruiter: { id: user.recruiter.id },
    })

    const savedVacancy = await this.vacanciesRepo.save(vacancy)

    if (funnelStepsDto) {
      for (const [funnelStepIdx, funnelStepDto] of funnelStepsDto.entries()) {
        await this.funnelStepsService.create({
          ...funnelStepDto,
          index: funnelStepIdx,
          vacancy: { id: savedVacancy.id },
        })
      }
    }

    return this.findOneById(savedVacancy.id)
  }
}
