import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { Skill } from "./entities/skills.entity"

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private readonly skillsRepo: Repository<Skill>,
  ) {}

  findAll() {
    return this.skillsRepo.find({
      order: { name: "ASC" },
    })
  }
}
