import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { Industry } from "./entities/industry.entity"

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industry)
    private readonly industriesRepo: Repository<Industry>,
  ) {}

  findAll() {
    return this.industriesRepo.find({
      order: { name: "ASC" },
    })
  }
}
