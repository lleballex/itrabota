import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import { Application } from "@/types/entities/application"

interface RejectApplicationData {
  applicationId: string
  message: string
}

export const useRejectApplication = createUseMutation(
  ({ applicationId, ...data }: RejectApplicationData) =>
    axios
      .post<Application>(`/applications/${applicationId}/reject`, data)
      .then((res) => res.data),
)
