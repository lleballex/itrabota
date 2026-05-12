import { Skill } from "../entities/skills.entity"

export function buildSkillSummary(skill: Skill): Skill {
  return {
    id: skill.id,
    createdAt: skill.createdAt,
    updatedAt: skill.updatedAt,
    name: skill.name,
  } as Skill
}
