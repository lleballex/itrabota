import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, Repository } from "typeorm"

import { Candidate } from "./entities/candidate.entity"

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidatesRepo: Repository<Candidate>,
  ) {}

  async findOneById(id: string) {
    const candidate = await this.candidatesRepo.findOneBy({ id })

    if (!candidate) {
      throw new NotFoundException("Candidate not found")
    }

    return candidate
  }

  async create(data: DeepPartial<Candidate>) {
    const candidate = this.candidatesRepo.create(data)
    const savedCandidate = await this.candidatesRepo.save(candidate)

    return this.findOneById(savedCandidate.id)
  }

  async update(id: string, data: DeepPartial<Candidate>) {
    const candidate = this.candidatesRepo.create({ ...data, id })
    await this.candidatesRepo.save(candidate)

    return this.findOneById(id)
  }
}
