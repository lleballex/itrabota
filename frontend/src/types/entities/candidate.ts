import { BaseEntity } from "./base-entity"

export interface Candidate extends BaseEntity {
  firstName: string
  lastName: string
  patronymic: string | null
}
