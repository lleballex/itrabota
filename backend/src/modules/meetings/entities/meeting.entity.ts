import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Application } from "@/modules/applications/entities/application.entity"
import { ApplicationMessage } from "@/modules/applications/entities/application-message.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { Recruiter } from "@/modules/users/entities/recruiter.entity"
import { FunnelStep } from "@/modules/vacancies/entities/funnel-step.entity"

@Entity("meeting")
@Unique(["applicationMessage"])
@Index("IDX_meeting_recruiter_starts_at", ["recruiter", "startsAt"])
@Index("IDX_meeting_recruiter_ends_at", ["recruiter", "endsAt"])
@Index("IDX_meeting_application_starts_at", ["application", "startsAt"])
export class Meeting extends BaseEntity {
  @ManyToOne(() => Application, (application) => application.meetings, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  application?: Application

  @ManyToOne(() => Candidate, (candidate) => candidate.meetings, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  candidate?: Candidate

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.meetings, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  recruiter?: Recruiter

  @ManyToOne(() => FunnelStep, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  funnelStep?: FunnelStep

  @OneToOne(
    () => ApplicationMessage,
    (applicationMessage) => applicationMessage.meeting,
    {
      nullable: false,
      onDelete: "CASCADE",
    },
  )
  @JoinColumn()
  applicationMessage?: ApplicationMessage

  @Column("timestamptz")
  startsAt!: Date

  @Column("timestamptz")
  endsAt!: Date

  @Column("varchar")
  timezone!: string

  @Column("varchar", { nullable: true })
  link!: string | null
}
