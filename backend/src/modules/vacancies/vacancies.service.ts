import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"

import { Vacancy } from "./entities/vacancy.entity"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { FunnelStepsService } from "./funnel-steps.service"
import { UpdateVacancyDto } from "./dto/update-vacancy-dto"

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
  ) {
    if (!funnelStepsDto) return

    if (vacancy.funnelSteps) {
      for (const funnelStep of vacancy.funnelSteps) {
        const funnelStepExists = funnelStepsDto.some(
          (i) => i.id === funnelStep.id,
        )

        if (!funnelStepExists) {
          await this.funnelStepsService.delete(funnelStep.id)
        }
      }
    }

    for (const [funnelStepIdx, funnelStepDto] of funnelStepsDto.entries()) {
      if (funnelStepDto.id) {
        await this.funnelStepsService.update(funnelStepDto.id, {
          ...funnelStepDto,
          index: funnelStepIdx,
        })
      } else {
        await this.funnelStepsService.create({
          ...funnelStepDto,
          index: funnelStepIdx,
          vacancy: { id: vacancy.id },
        })
      }
    }
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
    const { funnelSteps: funnelStepsDto, ...dto } = dto_

    const vacancy = await this.findOneById(id)
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    if (vacancy.recruiter?.id !== user.recruiter.id) {
      throw new ForbiddenException("You are not the author of the vacancy")
    }

    // TODO: start transaction

    const updatedVacancy = this.vacanciesRepo.create({ ...dto, id })
    await this.vacanciesRepo.save(updatedVacancy)

    await this.handleFunnelStepsUpsert(funnelStepsDto, vacancy)

    return this.findOneById(vacancy.id)
  }
}
