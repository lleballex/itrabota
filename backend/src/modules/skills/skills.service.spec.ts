import { ConflictException } from "@nestjs/common"
import { Repository } from "typeorm"

import { Skill } from "./entities/skills.entity"
import { SkillsService } from "./skills.service"
import { SkillDefinition } from "./types/skill-definition.type"

function createSkill(name: string, overrides?: Partial<Skill>): Skill {
  return {
    id: overrides?.id ?? `${name}-id`,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    name,
    implies: overrides?.implies ?? [],
    impliedBy: overrides?.impliedBy,
    impliesIds: overrides?.impliesIds,
  } as Skill
}

class InMemorySkillsRepository {
  constructor(private readonly skills: Skill[]) {}

  find() {
    return this.skills
  }

  findOne(options: { where: { name: string } }) {
    return (
      this.skills.find((skill) => skill.name === options.where.name) ?? null
    )
  }

  create(data: Partial<Skill>) {
    return createSkill(data.name ?? "unknown", data)
  }

  save(data: Skill | Skill[]) {
    const skills = Array.isArray(data) ? data : [data]

    for (const skill of skills) {
      const existingSkillIdx = this.skills.findIndex(
        (existingSkill) => existingSkill.id === skill.id,
      )

      if (existingSkillIdx >= 0) {
        this.skills[existingSkillIdx] = skill
        continue
      }

      this.skills.push(skill)
    }

    return data
  }
}

function createService(skills: Skill[]) {
  const repo = new InMemorySkillsRepository(skills)

  return new SkillsService(repo as unknown as Repository<Skill>)
}

describe("SkillsService", () => {
  it("builds transitive effective skills", async () => {
    const node = createSkill("Node.js")
    const react = createSkill("React.js", { implies: [node] })
    const next = createSkill("Next.js", { implies: [react] })
    const service = createService([node, react, next])

    await expect(service.resolveSkillSet([next.id])).resolves.toEqual({
      explicitSkillIds: [next.id],
      effectiveSkillIds: [next.id, react.id, node.id],
      impliedSkillIds: [react.id, node.id],
    })
  })

  it("deduplicates implied skills across multiple edges", async () => {
    const node = createSkill("Node.js")
    const react = createSkill("React.js", { implies: [node] })
    const next = createSkill("Next.js", { implies: [react, node] })
    const service = createService([node, react, next])

    await expect(service.resolveSkillSet([next.id])).resolves.toEqual({
      explicitSkillIds: [next.id],
      effectiveSkillIds: [next.id, react.id, node.id],
      impliedSkillIds: [react.id, node.id],
    })
  })

  it("does not infer reverse relations", async () => {
    const node = createSkill("Node.js")
    const react = createSkill("React.js", { implies: [node] })
    const next = createSkill("Next.js", { implies: [react] })
    const service = createService([node, react, next])

    await expect(service.resolveSkillSet([node.id])).resolves.toEqual({
      explicitSkillIds: [node.id],
      effectiveSkillIds: [node.id],
      impliedSkillIds: [],
    })
  })

  it("rejects cyclic graphs during sync", async () => {
    const node = createSkill("Node.js")
    const react = createSkill("React.js")
    const service = createService([node, react])
    const definitions: SkillDefinition[] = [
      { name: "Node.js", implies: ["React.js"] },
      { name: "React.js", implies: ["Node.js"] },
    ]

    await expect(service.syncDefinitions(definitions)).rejects.toBeInstanceOf(
      ConflictException,
    )
  })
})
