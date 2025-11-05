import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { UserRole } from "@/modules/users/types/user-role"

import { Application } from "./application.entity"

export const ApplicationMessageType = {
  UserMessage: "user",
  CandidateResponded: "candidate_responded",
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
}
