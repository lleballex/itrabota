import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import {
  RecruiterDashboardPeriod,
  RecruiterDashboardStats,
} from "@/types/recruiter-dashboard"

interface Params {
  period: RecruiterDashboardPeriod
  includeInvitations: boolean
}

export const useRecruiterDashboard = createUseQuery(
  "applications",
  async (params: Params) => {
    const res = await axios.get<RecruiterDashboardStats>(
      "/applications/recruiter/dashboard",
      {
        params,
      },
    )

    return res.data
  },
)
