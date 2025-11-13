import { Application } from "./application"
import { BaseEntity } from "./base-entity"
import { UserRole } from "./user"

export const ApplicationMessageType = {
  UserMessage: "user",
  CandidateResponded: "candidate_responded",
}

export type ApplicationMessageType =
  (typeof ApplicationMessageType)[keyof typeof ApplicationMessageType]

export interface ApplicationMessage extends BaseEntity {
  senderRole: UserRole
  type: ApplicationMessageType
  content: string | null
  application?: Application
}
