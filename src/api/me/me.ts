import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"

import { User } from "@/types/entities/user"

const mockedData: User = {
  id: "ad",
  createdAt: "sf",
  updatedAt: "af",
  email: "lleballex@gmail.com",
  role: "recruiter",
}

export const useMe = createUseQuery("me", () =>
  axios
    .get<User>("/me")
    .then((res) => res.data)
    .catch(() => mockedData)
)
