import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyWorkExperience,
} from "@/types/entities/vacancy"

interface Data {
  title: string
  description?: string | null
  requirements?: string | null
  niceToHave?: string | null
  responsibilities?: string | null
  conditions?: string | null
  salaryFrom?: number | null
  salaryTo?: number | null
  employmentType: VacancyEmploymentType
  format: VacancyFormat
  schedule: VacancySchedule
  workExperience: VacancyWorkExperience
  skillIds?: string[]
  specializationId: string
  cityId?: string | null
}

export const useCreateVacancy = createUseMutation((data: Data) =>
  axios.post("/vacancies", data)
)
