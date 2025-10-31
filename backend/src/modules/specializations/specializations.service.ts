import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { Specialization } from "./entities/specialization.entity"

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationsRepo: Repository<Specialization>,
  ) {}

  findAll() {
    return this.specializationsRepo.find({
      order: { name: "ASC" },
    })
  }
}
