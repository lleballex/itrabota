import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { UserRole } from "@/types/entities/user"
import { Application } from "@/types/entities/application"

interface RecruiterParams {
  role: typeof UserRole.Recruiter
  vacancyId: string
}

export const useApplications = createUseQuery(
  "applications",
  async ({ role, vacancyId }: RecruiterParams) => {
    const url = {
      [UserRole.Recruiter]: `/vacancies/${vacancyId}/applications`,
    }[role]

    const res = await axios.get<Application[]>(url)

    return res.data
  },
)
