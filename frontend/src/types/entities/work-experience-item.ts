import { BaseEntity } from "./base-entity"
import { Candidate } from "./candidate"

export interface WorkExperienceItem extends BaseEntity {
  position: string
  companyName: string
  startedAt: string
  endedAt: string | null
  description: string | null
  candidate?: Candidate
}
