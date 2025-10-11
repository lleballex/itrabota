import { BaseEntity } from "./base-entity"

export interface VacancyFunnelStep extends BaseEntity {
  index: number
  name: string
  approveMessage: string | null
  rejectMessage: string | null
  shouldCreateCall: boolean
}
