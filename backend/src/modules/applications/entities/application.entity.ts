import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { FunnelStep } from "@/modules/vacancies/entities/funnel-step.entity"

import { ApplicationMessage } from "./application-message.entity"

const ApplicationStatus = {
  Pending: "pending",
  Rejected: "rejected",
  Approved: "approved",
}
type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus]

@Entity("application")
export class Application extends BaseEntity {
  @Column("enum", {
    enum: ApplicationStatus,
    default: ApplicationStatus.Pending,
  })
  status!: ApplicationStatus

  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  candidate?: Candidate

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  vacancy?: Vacancy

  @ManyToOne(() => FunnelStep, (step) => step.applications, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  funnelStep?: FunnelStep | null

  @OneToMany(() => ApplicationMessage, (message) => message.application)
  messages?: ApplicationMessage[]
}
