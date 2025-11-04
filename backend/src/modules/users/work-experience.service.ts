import { Injectable } from "@nestjs/common"
import { DeepPartial, Repository } from "typeorm"

import { WorkExperienceItem } from "./entities/work-experence-item.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperienceItem)
    private readonly workExperienceRepo: Repository<WorkExperienceItem>,
  ) {}

  findOneById(id: string) {
    return this.workExperienceRepo.findOne({ where: { id } })
  }

  async create(data: DeepPartial<WorkExperienceItem>) {
    const workExperience = this.workExperienceRepo.create(data)
    const savedWorkExperience =
      await this.workExperienceRepo.save(workExperience)

    return this.findOneById(savedWorkExperience.id)
  }
}
