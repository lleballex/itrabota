import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Vacancy, VacancyStatus } from "@/types/entities/vacancy"
import { UserRole } from "@/types/entities/user"

interface RecruiterParams {
  role: typeof UserRole.Recruiter
  query?: string
  status?: VacancyStatus
}

interface CandidateParams {
  role: typeof UserRole.Candidate
  query?: string
}

export const useVacancies = createUseQuery(
  "vacancies",
  ({ role, ...params }: RecruiterParams | CandidateParams) => {
    const url = {
      [UserRole.Recruiter]: "/vacancies/recruiter",
      [UserRole.Candidate]: "/vacancies/candidate",
    }[role]

    return axios.get<Vacancy[]>(url, { params }).then((res) => res.data)
  }
)
