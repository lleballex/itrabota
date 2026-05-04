import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"

interface Data {
  applicationId: string
  message?: string
}

export const useOfferApplicationByRecruiter = createUseMutation(
  ({ applicationId, ...data }: Data) =>
    axios.post(`/applications/recruiter/${applicationId}/offer`, data),
  { invalidateQueries: ["applications"] },
)
