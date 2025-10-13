import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"

interface Data {
  email: string
  role: string
  password: string
}

export const useRegister = createUseMutation((data: Data) =>
  axios.post("/auth/register", data)
)
