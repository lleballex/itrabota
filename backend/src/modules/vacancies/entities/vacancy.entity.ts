import { BaseEntity } from "@/database/entities/base.entity"
import { City } from "@/modules/cities/entities/city.entity"
import { Skill } from "@/modules/skills/entities/skills.entity"
import { Specialization } from "@/modules/specializations/entities/specialization.entity"
import { Recruiter } from "@/modules/users/entities/recruiter.entity"
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"

export const VacancyStatus = {
  Active: "active",
  Archived: "archived",
} as const

export type VacancyStatus = (typeof VacancyStatus)[keyof typeof VacancyStatus]

export const VacancyEmploymentType = {
  FullTime: "full_time",
  PartTime: "part_time",
  Internship: "internship",
}

export type VacancyEmploymentType =
  (typeof VacancyEmploymentType)[keyof typeof VacancyEmploymentType]

export const VacancyFormat = {
  Office: "office",
  Remote: "remote",
  Hybrid: "hybrid",
}

export type VacancyFormat = (typeof VacancyFormat)[keyof typeof VacancyFormat]

export const VacancySchedule = {
  Flexible: "flexible",
  FiveTwo: "five_two",
  SixOne: "six_one",
  TwoTwo: "two_two",
  ThreeThree: "three_three",
  FourTwo: "four_two",
  Other: "other",
} as const

export type VacancySchedule =
  (typeof VacancySchedule)[keyof typeof VacancySchedule]

export const VacancyWorkExperience = {
  None: "none",
  UpToYear: "up_to_year",
  OneToThreeYears: "one_to_three_years",
  ThreeToFiveYears: "three_to_five_years",
  FromFiveYears: "from_five_years",
}

export type VacancyWorkExperience =
  (typeof VacancyWorkExperience)[keyof typeof VacancyWorkExperience]

@Entity("vacancy")
export class Vacancy extends BaseEntity {
  @Column("varchar")
  title!: string

  @Column("varchar", { nullable: true })
  description!: string | null

  @Column("varchar", { nullable: true })
  requirements!: string | null

  @Column("varchar", { nullable: true })
  niceToHave!: string | null

  @Column("varchar", { nullable: true })
  responsibilities!: string | null

  @Column("varchar", { nullable: true })
  conditions!: string | null

  @Column("enum", { enum: VacancyStatus, default: VacancyStatus.Active })
  status!: VacancyStatus

  @Column("int", { nullable: true })
  salaryFrom!: number | null

  @Column("int", { nullable: true })
  salaryTo!: number | null

  @Column("enum", { enum: VacancyEmploymentType })
  employmentType!: VacancyEmploymentType

  @Column("enum", { enum: VacancyFormat })
  format!: VacancyFormat

  @Column("enum", { enum: VacancySchedule })
  schedule!: VacancySchedule

  @Column("enum", { enum: VacancyWorkExperience })
  workExperience!: VacancyWorkExperience

  // responsesCount?: number // TODO

  @ManyToMany(() => Skill)
  @JoinTable()
  skills?: Skill[]

  @ManyToOne(() => Specialization, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn()
  specialization?: Specialization

  @ManyToOne(() => City, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  city?: City | null

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.vacancies, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  recruiter?: Recruiter
}
