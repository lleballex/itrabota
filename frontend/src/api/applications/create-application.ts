import { UserRole } from "@/types/entities/user"
import { axios } from "../lib/axios"
import { createUseMutation } from "../lib/create-use-mutation"

interface CreateCandidateApplicationData {
  role: typeof UserRole.Candidate
  vacancyId: string
  message?: string | null
}

interface CreateRecruiterApplicationData {
  role: typeof UserRole.Recruiter
  candidateId: string
  vacancyId: string
  message?: string | null
}

type Data = CreateCandidateApplicationData | CreateRecruiterApplicationData

export const useCreateApplication = createUseMutation(({ role, ...data }: Data) => {
  const url = {
    [UserRole.Candidate]: "/applications/candidate",
    [UserRole.Recruiter]: "/applications/recruiter",
  }[role]

  return axios.post(url, data)
})
