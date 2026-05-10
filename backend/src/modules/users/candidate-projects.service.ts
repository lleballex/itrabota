import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, EntityManager, Repository } from "typeorm"

import { CandidateProjectItem } from "./entities/candidate-project-item.entity"

@Injectable()
export class CandidateProjectsService {
  constructor(
    @InjectRepository(CandidateProjectItem)
    private readonly candidateProjectsRepo: Repository<CandidateProjectItem>,
  ) {}

  async findOneById(id: string, manager?: EntityManager) {
    const repo =
      manager?.getRepository(CandidateProjectItem) ?? this.candidateProjectsRepo
    const item = await repo.findOne({ where: { id } })

    if (!item) {
      throw new NotFoundException("Candidate project not found")
    }

    return item
  }

  async create(
    data: DeepPartial<CandidateProjectItem>,
    manager?: EntityManager,
  ) {
    const repo =
      manager?.getRepository(CandidateProjectItem) ?? this.candidateProjectsRepo

    const item = repo.create(data)
    const savedItem = await repo.save(item)

    return this.findOneById(savedItem.id, manager)
  }

  async update(
    id: string,
    data: DeepPartial<CandidateProjectItem>,
    manager?: EntityManager,
  ) {
    const repo =
      manager?.getRepository(CandidateProjectItem) ?? this.candidateProjectsRepo
    const item = repo.create({ ...data, id })

    await repo.save(item)

    return this.findOneById(id, manager)
  }

  async remove(id: string, manager?: EntityManager) {
    const repo =
      manager?.getRepository(CandidateProjectItem) ?? this.candidateProjectsRepo
    const item = await this.findOneById(id, manager)

    await repo.remove(item)
  }
}
