import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Candidate } from "@/types/entities/candidate"
import { UserRole } from "@/types/entities/user"

interface RecruiterParams {
  role: typeof UserRole.Recruiter
  query?: string
}

// TODO: only for recruiter now
export const useCandidates = createUseQuery(
  "candidates",
  async ({ role, ...params }: RecruiterParams) => {
    const url = {
      [UserRole.Recruiter]: "/candidates/recruiter",
    }[role]

    const res = await axios.get<Candidate[]>(url, { params })

    return res.data
  },
)
