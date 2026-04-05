import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"

interface Data {
  applicationId: string
}

export const useAcceptApplicationByCandidate = createUseMutation(
  ({ applicationId }: Data) =>
    axios.post(`/applications/candidate/${applicationId}/accept`),
)
