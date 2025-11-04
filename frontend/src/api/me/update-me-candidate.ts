import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"

interface Data {
  firstName?: string
  lastName?: string
  patronymic?: string | null
  bornAt?: string
  email?: string
  phoneNumber?: string | null
  tgUsername?: string | null
  description?: string | null
  cityId?: string | null
  avatar?: {
    name: string
    mimeType: string
    size: number
    content: string
  } | null
  skillIds?: string[]
  workExperience?: {
    id?: string
    position: string
    companyName: string
    startedAt: string
    endedAt?: string | null
    description?: string | null
  }[]
}

export const useUpdateMeCandidate = createUseMutation((data: Data) =>
  axios.patch("/me/candidate", data)
)
