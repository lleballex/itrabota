import { BaseEntity } from "./base-entity"
import { City } from "./city"
import { Company } from "./company"
import { Specialization } from "./specialization"
import { Skill } from "./skill"

export interface Vacancy extends BaseEntity {
  title: string
  description: string | null
  requirements: string | null
  niceToHave: string | null
  responsibilities: string | null
  conditions: string | null
  status: VacancyStatus
  salaryFrom: number | null
  salaryTo: number | null
  employmentType: VacancyEmploymentType
  format: VacancyFormat
  schedule: VacancySchedule
  workExperience: VacancyWorkExperience
  responsesCount?: number
  skills?: Skill[]
  specialization?: Specialization
  city?: City
  company?: Company
}

export const VacancyStatus = {
  Active: "active",
  Archived: "archived",
} as const

export type VacancyStatus = (typeof VacancyStatus)[keyof typeof VacancyStatus]

export const VacancyStatuses: Record<VacancyStatus, string> = {
  [VacancyStatus.Active]: "Активна",
  [VacancyStatus.Archived]: "В архиве",
}

export const VacancyEmploymentType = {
  FullTime: "full_time",
  PartTime: "part_time",
  Internship: "internship",
}

export type VacancyEmploymentType =
  (typeof VacancyEmploymentType)[keyof typeof VacancyEmploymentType]

export const VacancyEmploymentTypes: Record<VacancyEmploymentType, string> = {
  [VacancyEmploymentType.FullTime]: "Фулл-тайм",
  [VacancyEmploymentType.PartTime]: "Парт-тайм",
  [VacancyEmploymentType.Internship]: "Стажировка",
}

export const VacancyFormat = {
  Office: "office",
  Remote: "remote",
  Hybrid: "hybrid",
}

export type VacancyFormat = (typeof VacancyFormat)[keyof typeof VacancyFormat]

export const VacancyFormats: Record<VacancyFormat, string> = {
  [VacancyFormat.Office]: "В офисе",
  [VacancyFormat.Remote]: "Удаленно",
  [VacancyFormat.Hybrid]: "Гибрид",
}

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

export const VacancySchedules: Record<VacancySchedule, string> = {
  [VacancySchedule.Flexible]: "Свободный график",
  [VacancySchedule.FiveTwo]: "График 5/2",
  [VacancySchedule.SixOne]: "График 6/1",
  [VacancySchedule.TwoTwo]: "График 2/2",
  [VacancySchedule.ThreeThree]: "График 3/3",
  [VacancySchedule.FourTwo]: "График 4/2",
  [VacancySchedule.Other]: "Особый график",
}

export const VacancyWorkExperience = {
  None: "none",
  UpToYear: "up_to_year",
  OneToThreeYears: "one_to_three_years",
  ThreeToFiveYears: "three_to_five_years",
  FromFiveYears: "from_five_years",
}

export type VacancyWorkExperience =
  (typeof VacancyWorkExperience)[keyof typeof VacancyWorkExperience]

export const VacancyWorkExperiences: Record<VacancyWorkExperience, string> = {
  [VacancyWorkExperience.None]: "Без опыта",
  [VacancyWorkExperience.UpToYear]: "До 1 года",
  [VacancyWorkExperience.OneToThreeYears]: "От 1 до 3 лет",
  [VacancyWorkExperience.ThreeToFiveYears]: "От 3 до 5 лет",
  [VacancyWorkExperience.FromFiveYears]: "От 5 лет",
}
