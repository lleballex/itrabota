import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Specialization } from "@/types/entities/specialization"

const mockedData: Specialization[] = [
  {
    id: "1",
    createdAt: "1",
    updatedAt: "1",
    name: "Frontend",
  },
  {
    id: "1",
    createdAt: "1",
    updatedAt: "1",
    name: "Backend",
  },
  {
    id: "1",
    createdAt: "1",
    updatedAt: "1",
    name: "Devops",
  },
]

export const useSpecializations = createUseQuery("specializations", () =>
  axios
    .get<Specialization[]>("/specializations")
    .then((res) => res.data)
    .catch(() => mockedData)
)
