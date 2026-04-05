import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import { Application } from "@/types/entities/application"
import { UserRole } from "@/types/entities/user"

interface RejectApplicationData {
  applicationId: string
  role: UserRole
  message: string
}

export const useRejectApplication = createUseMutation(
  async ({ applicationId, role, ...data }: RejectApplicationData) => {
    const baseUrl = {
      [UserRole.Candidate]: "/applications/candidate",
      [UserRole.Recruiter]: "/applications/recruiter",
    }[role]

    const res = await axios.post<Application>(
      `${baseUrl}/${applicationId}/reject`,
      data,
    )

    return res.data
  },
)
