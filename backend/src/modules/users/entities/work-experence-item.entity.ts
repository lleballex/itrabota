import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

import { Candidate } from "./candidate.entity"

@Entity("work_experience_item")
export class WorkExperienceItem extends BaseEntity {
  @Column("varchar")
  position!: string

  @Column("varchar")
  companyName!: string

  @Column("timestamptz")
  startedAt!: string

  @Column("timestamptz", { nullable: true })
  endedAt!: string | null

  @Column("text", { nullable: true })
  description!: string | null

  @ManyToOne(() => Candidate, (candidate) => candidate.workExperience, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  candidate?: Candidate
}
