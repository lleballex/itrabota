import { SkillDefinition } from "../types/skill-definition.type"

export const SKILL_SEED_DATA: SkillDefinition[] = [
  {
    name: "Node.js",
  },
  {
    name: "React.js",
    implies: ["Node.js"],
  },
  {
    name: "Next.js",
    implies: ["React.js", "Node.js"],
  },
  {
    name: "SQL",
  },
  {
    name: "PostgreSQL",
    implies: ["SQL"],
  },
  {
    name: "Docker",
  },
  {
    name: "Kubernetes",
    implies: ["Docker"],
  },
]
