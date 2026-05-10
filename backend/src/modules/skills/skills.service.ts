import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, Repository } from "typeorm"

import { Skill } from "./entities/skills.entity"
import { buildSkillSummary } from "./lib/build-skill-summary"
import { SkillDefinition } from "./types/skill-definition.type"

type SkillContainer = {
  skills?: Skill[]
  explicitSkills?: Skill[]
  effectiveSkills?: Skill[]
  impliedSkills?: Skill[]
}

export type ResolvedSkillSet = {
  explicitSkillIds: string[]
  effectiveSkillIds: string[]
  impliedSkillIds: string[]
}

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private readonly skillsRepo: Repository<Skill>,
  ) {}

  private getRepo(manager?: EntityManager) {
    return manager?.getRepository(Skill) ?? this.skillsRepo
  }

  private async getCatalog(manager?: EntityManager) {
    return this.getRepo(manager).find({
      relations: {
        implies: true,
      },
      order: {
        name: "ASC",
        implies: {
          name: "ASC",
        },
      },
    })
  }

  private buildCatalogIndex(catalog: Skill[]) {
    return new Map(catalog.map((skill) => [skill.id, skill]))
  }

  private resolveEffectiveSkillIds(
    explicitSkillIds: string[],
    skillById: Map<string, Skill>,
  ) {
    const explicitIds = Array.from(new Set(explicitSkillIds))
    const visited = new Set<string>()
    const stack = [...explicitIds]

    while (stack.length) {
      const skillId = stack.pop()

      if (!skillId || visited.has(skillId)) {
        continue
      }

      visited.add(skillId)

      const skill = skillById.get(skillId)

      if (!skill?.implies?.length) {
        continue
      }

      for (const impliedSkill of [...skill.implies].reverse()) {
        if (!visited.has(impliedSkill.id)) {
          stack.push(impliedSkill.id)
        }
      }
    }

    return explicitIds
      .filter((skillId) => visited.has(skillId))
      .concat(
        Array.from(visited).filter((skillId) => !explicitIds.includes(skillId)),
      )
  }

  private buildResolvedSkillSet(
    explicitSkillIds: string[],
    skillById: Map<string, Skill>,
  ): ResolvedSkillSet {
    const uniqueExplicitSkillIds = Array.from(new Set(explicitSkillIds))
    const effectiveSkillIds = this.resolveEffectiveSkillIds(
      uniqueExplicitSkillIds,
      skillById,
    )

    return {
      explicitSkillIds: uniqueExplicitSkillIds,
      effectiveSkillIds,
      impliedSkillIds: effectiveSkillIds.filter(
        (skillId) => !uniqueExplicitSkillIds.includes(skillId),
      ),
    }
  }

  private assertNoCycles(skills: Skill[]) {
    const visiting = new Set<string>()
    const visited = new Set<string>()
    const pathIds: string[] = []
    const skillById = this.buildCatalogIndex(skills)

    const dfs = (skillId: string) => {
      if (visiting.has(skillId)) {
        const cycleStartIndex = pathIds.indexOf(skillId)
        const cyclePath = pathIds
          .slice(cycleStartIndex)
          .concat(skillId)
          .map((pathSkillId) => skillById.get(pathSkillId)?.name ?? pathSkillId)

        throw new ConflictException(
          `Skill implies graph contains a cycle: ${cyclePath.join(" -> ")}`,
        )
      }

      if (visited.has(skillId)) {
        return
      }

      visiting.add(skillId)
      pathIds.push(skillId)

      const skill = skillById.get(skillId)

      for (const impliedSkill of skill?.implies ?? []) {
        dfs(impliedSkill.id)
      }

      pathIds.pop()
      visiting.delete(skillId)
      visited.add(skillId)
    }

    for (const skill of skills) {
      dfs(skill.id)
    }
  }

  async findAll(manager?: EntityManager) {
    const skills = await this.getCatalog(manager)

    return skills.map(buildSkillSummary)
  }

  async resolveSkillSet(
    explicitSkillIds: string[],
    manager?: EntityManager,
  ): Promise<ResolvedSkillSet> {
    const catalog = await this.getCatalog(manager)
    return this.buildResolvedSkillSet(
      explicitSkillIds,
      this.buildCatalogIndex(catalog),
    )
  }

  async enrichSkillContainer<T extends SkillContainer>(
    container: T,
    manager?: EntityManager,
  ) {
    return this.enrichSkillContainers([container], manager).then(
      ([enrichedContainer]) => enrichedContainer,
    )
  }

  async enrichSkillContainers<T extends SkillContainer>(
    containers: T[],
    manager?: EntityManager,
  ) {
    if (!containers.length) {
      return containers
    }

    const catalog = await this.getCatalog(manager)
    const skillById = this.buildCatalogIndex(catalog)

    return containers.map((container) => {
      const explicitSkillIds = (container.skills ?? []).map((skill) => skill.id)
      const resolvedSkillSet = this.buildResolvedSkillSet(
        explicitSkillIds,
        skillById,
      )

      container.explicitSkills = resolvedSkillSet.explicitSkillIds
        .map((skillId) => skillById.get(skillId))
        .filter((skill): skill is Skill => !!skill)
        .map(buildSkillSummary)
      container.effectiveSkills = resolvedSkillSet.effectiveSkillIds
        .map((skillId) => skillById.get(skillId))
        .filter((skill): skill is Skill => !!skill)
        .map(buildSkillSummary)
      container.impliedSkills = resolvedSkillSet.impliedSkillIds
        .map((skillId) => skillById.get(skillId))
        .filter((skill): skill is Skill => !!skill)
        .map(buildSkillSummary)
      container.skills = container.explicitSkills

      return container
    })
  }

  async syncDefinitions(
    definitions: SkillDefinition[],
    manager?: EntityManager,
  ) {
    const repo = this.getRepo(manager)
    const normalizedDefinitions = definitions.map((definition) => ({
      ...definition,
      implies: Array.from(new Set(definition.implies ?? [])),
    }))

    for (const definition of normalizedDefinitions) {
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

    const catalog = await this.getCatalog(manager)
    const skillByName = new Map(catalog.map((skill) => [skill.name, skill]))

    for (const definition of normalizedDefinitions) {
      const skill = skillByName.get(definition.name)

      if (!skill) {
        throw new NotFoundException(`Skill ${definition.name} was not created`)
      }

      skill.implies = (definition.implies ?? []).map((impliedSkillName) => {
        const impliedSkill = skillByName.get(impliedSkillName)

        if (!impliedSkill) {
          throw new NotFoundException(
            `Implied skill ${impliedSkillName} was not found`,
          )
        }

        return impliedSkill
      })
    }

    this.assertNoCycles(catalog)

    await repo.save(catalog)

    return this.findAll(manager)
  }
}
