import { ApplicationMessage } from "./application-message"
import { BaseEntity } from "./base-entity"
import { Candidate } from "./candidate"
import { FunnelStep } from "./funnel-step"
import { Vacancy } from "./vacancy"

export const ApplicationStatus = {
  Pending: "pending",
  Rejected: "rejected",
  Approved: "approved",
} as const

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus]

export interface Application extends BaseEntity {
  status: ApplicationStatus
  candidate?: Candidate
  vacancy?: Vacancy
  funnelStep?: FunnelStep | null
  messages?: ApplicationMessage[]
}
