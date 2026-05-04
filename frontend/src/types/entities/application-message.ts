import { Application } from "./application"
import { BaseEntity } from "./base-entity"
import { Meeting } from "./meeting"
import { UserRole } from "./user"

export const ApplicationMessageType = {
  UserMessage: "user",
  CandidateResponded: "candidate_responded",
  RecruiterInvited: "recruiter_invited",
  CandidateAccepted: "candidate_accepted",
  RecruiterOfferedStep: "recruiter_offered_step",
  RecruiterOfferedJob: "recruiter_offered_job",
  CandidateRejected: "candidate_rejected",
  RecruiterRejected: "recruiter_rejected",
  VacancyArchived: "vacancy_archived",
  MeetingScheduled: "meeting_scheduled",
} as const

export type ApplicationMessageType =
  (typeof ApplicationMessageType)[keyof typeof ApplicationMessageType]

export interface ApplicationMessage extends BaseEntity {
  senderRole: UserRole
  type: ApplicationMessageType
  content: string | null
  application?: Application
  meeting?: Meeting | null
}
