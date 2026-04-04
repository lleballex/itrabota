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

import { UsersService } from "./users.service"
import { Candidate } from "./entities/candidate.entity"
import { ICandidatesSearchParams } from "./interfaces/candidates-service.interface"

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
      .leftJoinAndSelect("candidate.city", "city")
      .leftJoinAndSelect("candidate.avatar", "avatar")
      .leftJoinAndSelect("candidate.skills", "skills")
      .leftJoinAndSelect("candidate.workExperience", "workExperienceItem")
      .orderBy("candidate.createdAt", "DESC")

    if (params?.query) {
      qb.andWhere(
        new Brackets((query) => {
          query
            .where("candidate.firstName ILIKE :query", {
              query: `%${params.query}%`,
            })
            .orWhere("candidate.lastName ILIKE :query", {
              query: `%${params.query}%`,
            })
            .orWhere("candidate.patronymic ILIKE :query", {
              query: `%${params.query}%`,
            })
        }),
      )
    }

    return qb
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

    return candidate
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

    return qb.getMany()
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
