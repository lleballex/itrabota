import { Injectable, NotFoundException } from "@nestjs/common"
import { DeepPartial, EntityManager, Repository } from "typeorm"

import { WorkExperienceItem } from "./entities/work-experence-item.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperienceItem)
    private readonly workExperienceRepo: Repository<WorkExperienceItem>,
  ) {}

  async findOneById(id: string, manager?: EntityManager) {
    const repo =
      manager?.getRepository(WorkExperienceItem) ?? this.workExperienceRepo
    const item = await repo.findOne({ where: { id } })

    if (!item) {
      throw new NotFoundException("WorkExperienceItem not found")
    }

    return item
  }

  async create(data: DeepPartial<WorkExperienceItem>, manager?: EntityManager) {
    const repo =
      manager?.getRepository(WorkExperienceItem) ?? this.workExperienceRepo

    const item = repo.create(data)
    const savedItem = await repo.save(item)

    return this.findOneById(savedItem.id, manager)
  }

  async update(
    id: string,
    data: DeepPartial<WorkExperienceItem>,
    manager?: EntityManager,
  ) {
    const repo =
      manager?.getRepository(WorkExperienceItem) ?? this.workExperienceRepo
    const item = repo.create({ ...data, id })

    await repo.save(item)

    return this.findOneById(id, manager)
  }

  async remove(id: string, manager?: EntityManager) {
    const repo =
      manager?.getRepository(WorkExperienceItem) ?? this.workExperienceRepo
    const item = await this.findOneById(id, manager)

    await repo.remove(item)
  }
}
