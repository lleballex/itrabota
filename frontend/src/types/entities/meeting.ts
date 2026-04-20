import type { Application } from "./application"
import type { ApplicationMessage } from "./application-message"
import { BaseEntity } from "./base-entity"
import type { Candidate } from "./candidate"
import type { FunnelStep } from "./funnel-step"
import type { Recruiter } from "./recruiter"

export interface Meeting extends BaseEntity {
  application?: Application
  applicationMessage?: ApplicationMessage
  candidate?: Candidate
  recruiter?: Recruiter
  funnelStep?: FunnelStep
  startsAt: string
  endsAt: string
  timezone: string
  link: string | null
}
