import { Entity, JoinColumn, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

import { User } from "./user.entity"

@Entity("candidate")
export class Candidate extends BaseEntity {
  @OneToOne(() => User, (user) => user.candidate, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user?: User
}
