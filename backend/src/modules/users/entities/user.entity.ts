import { Column, Entity, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { UserRole } from "@/modules/users/types/user-role"

import { Candidate } from "./candidate.entity"
import { Recruiter } from "./recruiter.entity"

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
    onDelete: "SET NULL",
  })
  candidate?: Candidate | null

  @OneToOne(() => Recruiter, (recruiter) => recruiter.user, {
    nullable: true,
    onDelete: "SET NULL",
  })
  recruiter?: Recruiter | null
}
