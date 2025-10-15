import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, Repository } from "typeorm"

import { Recruiter } from "./entities/recruiter.entity"

@Injectable()
export class RecruitersService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruitersRepo: Repository<Recruiter>,
  ) {}

  async findOneById(id: string) {
    const recruiter = await this.recruitersRepo.findOneBy({ id })

    if (!recruiter) {
      throw new Error("Recruiter not found")
    }

    return recruiter
  }

  async create(data: DeepPartial<Recruiter>) {
    const recruiter = this.recruitersRepo.create(data)
    const savedRecruiter = await this.recruitersRepo.save(recruiter)

    return this.findOneById(savedRecruiter.id)
  }
}
