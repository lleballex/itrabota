import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/types/entities/vacancy"

interface Data {
  firstName: string
  lastName: string
  patronymic?: string | null
  bornAt: string
  email?: string
  phoneNumber?: string | null
  tgUsername?: string | null
  description?: string | null
  isHidden?: boolean
  cityId?: string | null
  specializationId?: string | null
  employmentType?: VacancyEmploymentType | null
  format?: VacancyFormat | null
  schedule?: VacancySchedule | null
  salaryFrom?: number | null
  salaryTo?: number | null
  avatar?: {
    name: string
    mimeType: string
    size: number
    content?: string
  } | null
  skillIds?: string[]
  workExperience?: {
    position: string
    companyName: string
    startedAt: string
    endedAt?: string | null
    description?: string | null
  }[]
}

export const useCreateMeCandidate = createUseMutation(
  (data: Data) => axios.post("/me/candidate", data),
  {
    invalidateQueries: [
      "me",
      "applications",
      "vacancies",
      "candidates",
      "notifications",
    ],
  },
)
