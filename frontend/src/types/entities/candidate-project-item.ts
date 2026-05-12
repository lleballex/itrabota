import { BaseEntity } from "./base-entity"
import { Candidate } from "./candidate"
import { Skill } from "./skill"

export interface CandidateProjectItem extends BaseEntity {
  title: string
  url: string | null
  description: string | null
  skills?: Skill[]
  candidate?: Candidate
}
