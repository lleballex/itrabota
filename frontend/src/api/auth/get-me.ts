import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"

import { User } from "@/types/entities/user"

export const useMe = createUseQuery(
  "me",
  () => axios.get<User>("/me").then((res) => res.data),
  { retry: false }
)
