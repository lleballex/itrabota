import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { UserRole } from "@/modules/users/types/user-role"
import { Meeting } from "@/modules/meetings/entities/meeting.entity"

import { Application } from "./application.entity"

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
}

export type ApplicationMessageType =
  (typeof ApplicationMessageType)[keyof typeof ApplicationMessageType]

@Entity("application_message")
export class ApplicationMessage extends BaseEntity {
  @Column("enum", { enum: UserRole })
  senderRole!: UserRole

  @Column("enum", { enum: ApplicationMessageType })
  type!: ApplicationMessageType

  @Column("text", { nullable: true })
  content!: string | null

  @ManyToOne(() => Application, (application) => application.messages, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  application?: Application

  @OneToOne(() => Meeting, (meeting) => meeting.applicationMessage)
  meeting?: Meeting | null
}
