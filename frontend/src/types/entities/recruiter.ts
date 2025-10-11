import { BaseEntity } from "./base-entity"
import { Company } from "./company"

export interface Recruiter extends BaseEntity {
  firstName: string
  lastName: string
  patronymic: string | null
  company?: Company
}
