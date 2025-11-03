import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"

interface Data {
  email?: string
  firstName?: string
  lastName?: string
  patronymic?: string | null
  company?: {
    name?: string
    url?: string | null
    industryId: string
    logo?: {
      name: string
      mimeType: string
      size: number
      content: string
    } | null
  }
}

export const useUpdateMeRecruiter = createUseMutation((data: Data) =>
  axios.patch("/me/recruiter", data)
)
