import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { Meeting } from "@/types/entities/meeting"
import { UserRole } from "@/types/entities/user"

interface Params {
  role: UserRole
  from: string
  to: string
}

export const useMeetings = createUseQuery(
  "meetings",
  async ({ role, from, to }: Params) => {
    const url = {
      [UserRole.Candidate]: "/meetings/candidate",
      [UserRole.Recruiter]: "/meetings/recruiter",
    }[role]

    const res = await axios.get<Meeting[]>(url, {
      params: { from, to },
    })

    return res.data
  },
)
