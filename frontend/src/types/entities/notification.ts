import { ApplicationMessageType } from "./application-message"
import { Application } from "./application"
import { BaseEntity } from "./base-entity"
import { Meeting } from "./meeting"
import { User } from "./user"

export const NotificationType = {
  CandidateResponded: ApplicationMessageType.CandidateResponded,
  RecruiterInvited: ApplicationMessageType.RecruiterInvited,
  CandidateAccepted: ApplicationMessageType.CandidateAccepted,
  RecruiterOfferedStep: ApplicationMessageType.RecruiterOfferedStep,
  RecruiterOfferedJob: ApplicationMessageType.RecruiterOfferedJob,
  CandidateRejected: ApplicationMessageType.CandidateRejected,
  RecruiterRejected: ApplicationMessageType.RecruiterRejected,
  MeetingScheduled: ApplicationMessageType.MeetingScheduled,
} as const

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType]

export interface Notification extends BaseEntity {
  recipientUser?: User
  type: NotificationType
  readAt: string | null
  application?: Application
  applicationMessage?: {
    id: string
  }
  meeting?: Meeting | null
}
