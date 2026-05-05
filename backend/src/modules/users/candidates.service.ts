import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  Brackets,
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import {
  createCaseInsensitiveSearchExpression,
  normalizeSearchQuery,
} from "@/common/lib/search"

import { UsersService } from "./users.service"
import { Candidate } from "./entities/candidate.entity"
import { ICandidatesSearchParams } from "./interfaces/candidates-service.interface"
import { calculateTotalWorkExperienceMonths } from "./lib/calculate-total-work-experience-months"

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
      .orderBy("candidate.createdAt", "DESC")

    const query = normalizeSearchQuery(params?.query)

    if (query) {
      const firstNameSearch = createCaseInsensitiveSearchExpression(
        "candidate.firstName",
      )
      const lastNameSearch =
        createCaseInsensitiveSearchExpression("candidate.lastName")
      const patronymicSearch = createCaseInsensitiveSearchExpression(
        "candidate.patronymic",
      )
      const fullNameSearch = createCaseInsensitiveSearchExpression(
        "concat_ws(' ', candidate.lastName, candidate.firstName, candidate.patronymic)",
      )

      qb.andWhere(
        new Brackets((searchQb) => {
          searchQb
            .where(`${firstNameSearch} LIKE :query`)
            .orWhere(`${lastNameSearch} LIKE :query`)
            .orWhere(`${patronymicSearch} LIKE :query`)
            .orWhere(`${fullNameSearch} LIKE :query`)
        }),
        { query: `%${query}%` },
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

  private async findOne(
    where: FindOptionsWhere<Candidate>,
    manager?: EntityManager,
  ) {
    const qb = this.createQB(undefined, manager).setFindOptions({ where })

    const candidate = await qb.getOne()

    if (!candidate) {
      throw new NotFoundException("Candidate not found") // TODO: unified exception
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
