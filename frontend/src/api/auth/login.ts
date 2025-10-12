import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"

interface Data {
  email: string
  password: string
}

export const useLogin = createUseMutation((data: Data) =>
  axios.post("/auth/login", data)
)
