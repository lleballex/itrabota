import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Recruiter } from "@/modules/users/entities/recruiter.entity"
import { FunnelStep } from "@/modules/vacancies/entities/funnel-step.entity"

import { Application } from "./application.entity"

export const ApplicationStageRecommendation = {
  Recommend: "recommend",
  Doubt: "doubt",
  Reject: "reject",
  NoDecision: "no_decision",
} as const

export type ApplicationStageRecommendation =
  (typeof ApplicationStageRecommendation)[keyof typeof ApplicationStageRecommendation]

@Entity("application_stage_result")
@Unique(["application", "funnelStep"])
export class ApplicationStageResult extends BaseEntity {
  @ManyToOne(() => Application, (application) => application.stageResults, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  application?: Application

  @ManyToOne(() => FunnelStep, (funnelStep) => funnelStep.stageResults, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  funnelStep?: FunnelStep

  @ManyToOne(
    () => Recruiter,
    (authorRecruiter) => authorRecruiter.applicationStageResults,
    {
      nullable: false,
      onDelete: "CASCADE",
    },
  )
  @JoinColumn()
  authorRecruiter?: Recruiter

  @Column("text", { nullable: true })
  summary!: string | null

  @Column("text", { nullable: true })
  pros!: string | null

  @Column("text", { nullable: true })
  cons!: string | null

  @Column("text", { nullable: true })
  notes!: string | null

  @Column("enum", {
    enum: ApplicationStageRecommendation,
    nullable: true,
  })
  recommendation!: ApplicationStageRecommendation | null
}
