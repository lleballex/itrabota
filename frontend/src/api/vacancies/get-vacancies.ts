import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Vacancy, VacancyStatus } from "@/types/entities/vacancy"
import { UserRole } from "@/types/entities/user"

interface RecruiterParams {
  role: typeof UserRole.Recruiter
  query?: string
  status?: VacancyStatus
}

export const useVacancies = createUseQuery(
  "vacancies",
  ({ role, ...params }: RecruiterParams) => {
    return axios
      .get<Vacancy[]>("/vacancies/recruiter", { params })
      .then((res) => res.data)
  }
)
