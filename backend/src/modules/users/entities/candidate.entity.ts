import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Attachment } from "@/modules/attachments/entities/attachment.entity"
import { City } from "@/modules/cities/entities/city.entity"
import { Skill } from "@/modules/skills/entities/skills.entity"
import { Application } from "@/modules/applications/entities/application.entity"

import { User } from "./user.entity"
import { WorkExperienceItem } from "./work-experence-item.entity"

@Entity("candidate")
export class Candidate extends BaseEntity {
  @Column("varchar")
  firstName!: string

  @Column("varchar")
  lastName!: string

  @Column("varchar", { nullable: true })
  patronymic!: string | null

  @Column("timestamptz")
  bornAt!: Date

  @Column("varchar", { nullable: true })
  phoneNumber!: string | null

  @Column("varchar", { nullable: true })
  tgUsername!: string | null

  @Column("text", { nullable: true })
  description!: string | null

  @OneToOne(() => City, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  city?: City | null

  @ManyToMany(() => Skill)
  @JoinTable()
  skills?: Skill[]

  @OneToMany(() => WorkExperienceItem, (item) => item.candidate)
  workExperience?: WorkExperienceItem[]

  @OneToOne(() => Attachment, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  avatar?: Attachment | null

  @OneToOne(() => User, (user) => user.candidate, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user?: User

  @OneToMany(() => Application, (application) => application.candidate)
  applications?: Application[]
}
