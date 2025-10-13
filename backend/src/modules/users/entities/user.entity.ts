import { Column, Entity, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

import { Candidate } from "./candidate.entity"
import { Recruiter } from "./recruiter.entity"

export const UserRole = {
  Recruiter: "recruiter",
  Candidate: "candidate",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

@Entity("user")
export class User extends BaseEntity {
  @Column("varchar", { unique: true })
  email!: string

  @Column("varchar", { select: false })
  password?: string

  @Column("enum", { enum: UserRole })
  role!: UserRole

  @Column("timestamptz", { nullable: true })
  passwordChangedAt!: Date | null

  @OneToOne(() => Candidate, (candidate) => candidate.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  candidate?: Candidate | null

  @OneToOne(() => Recruiter, (recruiter) => recruiter.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  recruiter?: Recruiter | null
}
