import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Application } from "@/modules/applications/entities/application.entity"
import { ApplicationMessage } from "@/modules/applications/entities/application-message.entity"
import { Meeting } from "@/modules/meetings/entities/meeting.entity"
import { User } from "@/modules/users/entities/user.entity"

export const NotificationType = {
  CandidateResponded: "candidate_responded",
  RecruiterInvited: "recruiter_invited",
  CandidateAccepted: "candidate_accepted",
  RecruiterOfferedStep: "recruiter_offered_step",
  RecruiterOfferedJob: "recruiter_offered_job",
  CandidateRejected: "candidate_rejected",
  RecruiterRejected: "recruiter_rejected",
  MeetingScheduled: "meeting_scheduled",
}

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType]

@Entity("notification")
@Unique(["applicationMessage", "recipientUser"])
export class Notification extends BaseEntity {
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  recipientUser?: User

  @Column("enum", { enum: NotificationType })
  type!: NotificationType

  @Column("timestamptz", { nullable: true })
  readAt!: Date | null

  @ManyToOne(() => Application, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  application?: Application

  @OneToOne(() => ApplicationMessage, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  applicationMessage?: ApplicationMessage

  @ManyToOne(() => Meeting, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  meeting?: Meeting | null
}
