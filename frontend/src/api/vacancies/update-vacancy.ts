import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyWorkExperience,
} from "@/types/entities/vacancy"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"

interface Data {
  id: string
  title?: string
  description?: string | null
  requirements?: string | null
  niceToHave?: string | null
  responsibilities?: string | null
  conditions?: string | null
  salaryFrom?: number | null
  salaryTo?: number | null
  employmentType?: VacancyEmploymentType
  format?: VacancyFormat
  schedule?: VacancySchedule
  workExperience?: VacancyWorkExperience
  skillIds?: string[]
  specializationId?: string
  cityId?: string | null
  funnelSteps?: {
    id?: string
    name: string
    approveMessage?: string | null
    rejectMessage?: string | null
    shouldCreateCall: boolean
  }[]
}

export const useUpdateVacancy = createUseMutation(({ id, ...data }: Data) =>
  axios.patch(`/vacancies/${id}`, data)
)
