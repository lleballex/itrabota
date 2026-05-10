import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/modules/vacancies/entities/vacancy.entity"

export interface ICandidatesSearchParams {
  query?: string
  employmentTypes?: VacancyEmploymentType[]
  formats?: VacancyFormat[]
  schedules?: VacancySchedule[]
  specializationIds?: string[]
  cityIds?: string[]
  skillIds?: string[]
  salaryFrom?: number
  salaryTo?: number
  totalWorkExperienceMonthsMin?: number
  projectsCountMin?: number
  ageFrom?: number
  ageTo?: number
}
