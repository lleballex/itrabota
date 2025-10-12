import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"

export const useLogout = createUseMutation((_args, ctx) =>
  axios.post("/auth/logout").then(() => {
    ctx.client.resetQueries()
  })
)
