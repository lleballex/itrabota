import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"

import { User, UserRole } from "@/types/entities/user"

const mockedData: User = {
  id: "ad",
  createdAt: "sf",
  updatedAt: "af",
  email: "lleballex@gmail.com",
  role: UserRole.Recruiter,
  passwordChangedAt: "2022-01-01T10:00Z",
  profile: {
    id: "aa",
    createdAt: "sf",
    updatedAt: "af",
    firstName: "Алексей",
    lastName: "Лебедев",
    patronymic: "Юрьевич",
    company: {
      id: "ad",
      createdAt: "sf",
      updatedAt: "af",
      name: "Технопарк",
      logo: null,
      url: null,
    },
  },
}

export const useMe = createUseQuery("me", () =>
  axios
    .get<User>("/me")
    .then((res) => res.data)
    .catch(() => mockedData)
)
