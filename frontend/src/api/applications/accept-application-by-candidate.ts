import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import { Application } from "@/types/entities/application"

interface Data {
  applicationId: string
  meetingStartsAt?: string
}

export const useAcceptApplicationByCandidate = createUseMutation(
  ({ applicationId, ...data }: Data) =>
    axios
      .post<Application>(`/applications/candidate/${applicationId}/accept`, data)
      .then((res) => res.data),
)
