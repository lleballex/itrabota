import { Application } from "./application"
import { BaseEntity } from "./base-entity"
import { FunnelStep } from "./funnel-step"
import { Recruiter } from "./recruiter"

export const ApplicationStageRecommendation = {
  Recommend: "recommend",
  Reject: "reject",
  Doubt: "doubt",
  NoDecision: "no_decision",
} as const

export type ApplicationStageRecommendation =
  (typeof ApplicationStageRecommendation)[keyof typeof ApplicationStageRecommendation]

export const ApplicationStageRecommendationLabels: Record<
  ApplicationStageRecommendation,
  string
> = {
  [ApplicationStageRecommendation.Recommend]: "Принять",
  [ApplicationStageRecommendation.Reject]: "Отклонить",
  [ApplicationStageRecommendation.Doubt]: "Держать",
  [ApplicationStageRecommendation.NoDecision]: "Непонятно",
}

export interface ApplicationStageResult extends BaseEntity {
  application?: Application
  funnelStep?: FunnelStep
  authorRecruiter?: Recruiter
  summary: string | null
  pros: string | null
  cons: string | null
  notes: string | null
  recommendation: ApplicationStageRecommendation | null
}
