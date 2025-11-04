import { Injectable, NotFoundException } from "@nestjs/common"
import { DeepPartial, Repository } from "typeorm"

import { WorkExperienceItem } from "./entities/work-experence-item.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperienceItem)
    private readonly workExperienceRepo: Repository<WorkExperienceItem>,
  ) {}

  async findOneById(id: string) {
    const item = await this.workExperienceRepo.findOne({ where: { id } })

    if (!item) {
      throw new NotFoundException("WorkExperienceItem not found")
    }

    return item
  }

  async create(data: DeepPartial<WorkExperienceItem>) {
    const item = this.workExperienceRepo.create(data)
    const savedItem = await this.workExperienceRepo.save(item)

    return this.findOneById(savedItem.id)
  }

  async update(id: string, data: DeepPartial<WorkExperienceItem>) {
    const item = this.workExperienceRepo.create({ ...data, id })
    await this.workExperienceRepo.save(item)

    return this.findOneById(id)
  }

  async remove(id: string) {
    const item = await this.findOneById(id)
    await this.workExperienceRepo.remove(item)
  }
}
