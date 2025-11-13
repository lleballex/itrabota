import { axios } from "../lib/axios"
import { createUseMutation } from "../lib/create-use-mutation"

interface Data {
  vacancyId: string
  content?: string | null
}

export const useCreateApplication = createUseMutation(
  ({ vacancyId, ...data }: Data) =>
    axios.post(`/vacancies/${vacancyId}/applications`, data)
)
