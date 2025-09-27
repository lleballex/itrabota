import { BaseEntity } from "./base-entity"

export interface Recruiter extends BaseEntity {
  firstName: string
  lastName: string
  patronymic: string | null
}
