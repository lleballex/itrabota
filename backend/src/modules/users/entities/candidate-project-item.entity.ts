import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Skill } from "@/modules/skills/entities/skills.entity"

import { Candidate } from "./candidate.entity"

@Entity("candidate_project_item")
export class CandidateProjectItem extends BaseEntity {
  @Column("varchar")
  title!: string

  @Column("varchar", { nullable: true })
  url!: string | null

  @Column("text", { nullable: true })
  description!: string | null

  @ManyToMany(() => Skill)
  @JoinTable()
  skills?: Skill[]

  @ManyToOne(() => Candidate, (candidate) => candidate.projects, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  candidate?: Candidate
}
