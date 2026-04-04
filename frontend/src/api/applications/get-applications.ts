import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { UserRole } from "@/types/entities/user"
import {
  Application,
  ApplicationStatus,
  ApplicationType,
} from "@/types/entities/application"

interface RecruiterParams {
  role: typeof UserRole.Recruiter
  query?: string
  status?: ApplicationStatus
  type?: ApplicationType
}

interface RecruiterByVacancyParams {
  role: typeof UserRole.Recruiter
  vacancyId: string
}

interface CandidateParams {
  role: typeof UserRole.Candidate
  query?: string
  status?: ApplicationStatus
  type?: ApplicationType
}

export const useApplications = createUseQuery(
  "applications",
  async ({
    role,
    ...params
  }: RecruiterParams | RecruiterByVacancyParams | CandidateParams) => {
    if ("vacancyId" in params) {
      const res = await axios.get<Application[]>(
        `/vacancies/${params.vacancyId}/applications`,
      )

      return res.data
    }

    const url = {
      [UserRole.Recruiter]: "/applications/recruiter",
      [UserRole.Candidate]: "/applications/candidate",
    }[role]

    const res = await axios.get<Application[]>(url, { params })

    return res.data
  },
)
