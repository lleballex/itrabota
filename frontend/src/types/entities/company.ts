import { BaseEntity } from "./base-entity"
import type { Industry } from "./industry"

export interface Company extends BaseEntity {
  name: string
  url: string | null
  logo: string | null
  industry?: Industry
}
