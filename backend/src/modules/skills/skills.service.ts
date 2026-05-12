import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, Repository } from "typeorm"

import { Skill } from "./entities/skills.entity"
import { buildSkillSummary } from "./lib/build-skill-summary"
import { SkillDefinition } from "./types/skill-definition.type"

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private readonly skillsRepo: Repository<Skill>,
  ) {}

  private getRepo(manager?: EntityManager) {
    return manager?.getRepository(Skill) ?? this.skillsRepo
  }

  async findAll(manager?: EntityManager) {
    const skills = await this.getRepo(manager).find({
      order: {
        name: "ASC",
      },
    })

    return skills.map(buildSkillSummary)
  }

  async syncDefinitions(
    definitions: SkillDefinition[],
    manager?: EntityManager,
  ) {
    const repo = this.getRepo(manager)

    for (const definition of definitions) {
      const existingSkill = await repo.findOne({
        where: {
          name: definition.name,
        },
      })

      if (!existingSkill) {
        await repo.save(
          repo.create({
            name: definition.name,
          }),
        )
      }
    }

    return this.findAll(manager)
  }
}
