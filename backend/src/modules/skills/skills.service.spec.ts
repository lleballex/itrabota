import { Repository } from "typeorm"

import { Skill } from "./entities/skills.entity"
import { SkillsService } from "./skills.service"

function createSkill(name: string, overrides?: Partial<Skill>): Skill {
  return {
    id: overrides?.id ?? `${name}-id`,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    name,
  } as Skill
}

class InMemorySkillsRepository {
  constructor(private readonly skills: Skill[]) {}

  find() {
    return [...this.skills].sort((left, right) =>
      left.name.localeCompare(right.name),
    )
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
  it("returns skills sorted by name", async () => {
    const service = createService([
      createSkill("TypeScript"),
      createSkill("CSS"),
      createSkill("React.js"),
    ])

    await expect(service.findAll()).resolves.toEqual([
      expect.objectContaining({ name: "CSS" }),
      expect.objectContaining({ name: "React.js" }),
      expect.objectContaining({ name: "TypeScript" }),
    ])
  })

  it("creates only missing skills during sync", async () => {
    const existingSkill = createSkill("React.js")
    const service = createService([existingSkill])

    await service.syncDefinitions([{ name: "React.js" }, { name: "Node.js" }])

    await expect(service.findAll()).resolves.toEqual([
      expect.objectContaining({ name: "Node.js" }),
      expect.objectContaining({ name: "React.js" }),
    ])
  })
})
