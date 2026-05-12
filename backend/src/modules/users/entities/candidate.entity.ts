import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Attachment } from "@/modules/attachments/entities/attachment.entity"
import { City } from "@/modules/cities/entities/city.entity"
import { Skill } from "@/modules/skills/entities/skills.entity"
import { Application } from "@/modules/applications/entities/application.entity"
import { Meeting } from "@/modules/meetings/entities/meeting.entity"
import { Specialization } from "@/modules/specializations/entities/specialization.entity"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/modules/vacancies/entities/vacancy.entity"

import { User } from "./user.entity"
import { CandidateProjectItem } from "./candidate-project-item.entity"
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

  @Column("varchar", { nullable: true })
  education!: string | null

  @Column("varchar", { nullable: true })
  githubUrl!: string | null

  @Column("varchar", { nullable: true })
  gitlabUrl!: string | null

  @Column("boolean", { default: false })
  isHidden!: boolean

  @ManyToOne(() => City, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  city?: City | null

  @ManyToOne(() => Specialization, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  specialization?: Specialization | null

  @Column("enum", { enum: VacancyEmploymentType, nullable: true })
  employmentType?: VacancyEmploymentType | null

  @Column("enum", { enum: VacancyFormat, nullable: true })
  format?: VacancyFormat | null

  @Column("enum", { enum: VacancySchedule, nullable: true })
  schedule?: VacancySchedule | null

  @Column("int", { nullable: true })
  salaryFrom?: number | null

  @Column("int", { nullable: true })
  salaryTo?: number | null

  @ManyToMany(() => Skill)
  @JoinTable()
  skills?: Skill[]

  @OneToMany(() => WorkExperienceItem, (item) => item.candidate)
  workExperience?: WorkExperienceItem[]

  @OneToMany(() => CandidateProjectItem, (item) => item.candidate)
  projects?: CandidateProjectItem[]

  totalWorkExperienceMonths?: number

  matchPercent?: number

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

  @OneToMany(() => Meeting, (meeting) => meeting.candidate)
  meetings?: Meeting[]
}
