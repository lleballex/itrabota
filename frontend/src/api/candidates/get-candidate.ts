import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { Candidate } from "@/types/entities/candidate"

interface Params {
  id: string
}

// TODO: only for recruiter now
export const useCandidate = createUseQuery("candidates", ({ id }: Params) =>
  axios.get<Candidate>(`/candidates/recruiter/${id}`).then((res) => res.data),
)
