import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"

interface Data {
  email?: string
  firstName: string
  lastName: string
  patronymic?: string | null
  company: {
    name: string
    url?: string | null
    logo?: {
      name: string
      mimeType: string
      size: number
      content: string
    } | null
  }
}

export const useCreateMeRecruiter = createUseMutation((data: Data) =>
  axios.post("/me/recruiter", data)
)
