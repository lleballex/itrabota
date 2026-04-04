import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, EntityManager, Repository } from "typeorm"

import { Recruiter } from "./entities/recruiter.entity"

@Injectable()
export class RecruitersService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruitersRepo: Repository<Recruiter>,
  ) {}

  async findOneById(id: string, manager?: EntityManager) {
    const repo = manager?.getRepository(Recruiter) ?? this.recruitersRepo
    const recruiter = await repo.findOneBy({ id })

    if (!recruiter) {
      throw new Error("Recruiter not found")
    }

    return recruiter
  }

  async create(data: DeepPartial<Recruiter>, manager?: EntityManager) {
    const repo = manager?.getRepository(Recruiter) ?? this.recruitersRepo

    const recruiter = repo.create(data)
    const savedRecruiter = await repo.save(recruiter)

    return this.findOneById(savedRecruiter.id, manager)
  }

  async update(
    id: string,
    data: DeepPartial<Recruiter>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Recruiter) ?? this.recruitersRepo
    const recruiter = repo.create({ id, ...data })

    await repo.save(recruiter)
    return this.findOneById(id, manager)
  }
}
