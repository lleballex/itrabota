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

export const ApplicationStatuses: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Pending]: "В процессе",
  [ApplicationStatus.Approved]: "Принят",
  [ApplicationStatus.Rejected]: "Отклонен",
}

export const ApplicationType = {
  Response: "response",
  Invitation: "invitation",
} as const

export type ApplicationType = (typeof ApplicationType)[keyof typeof ApplicationType]

export const ApplicationTypes: Record<ApplicationType, string> = {
  [ApplicationType.Response]: "Отклик",
  [ApplicationType.Invitation]: "Приглашение",
}

export interface Application extends BaseEntity {
  type: ApplicationType
  status: ApplicationStatus
  candidate?: Candidate
  vacancy?: Vacancy
  funnelStep?: FunnelStep | null
  messages?: ApplicationMessage[]
}
