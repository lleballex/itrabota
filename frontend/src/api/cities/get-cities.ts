import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { City } from "@/types/entities/city"

const mockedData: City[] = [
  {
    id: "1",
    createdAt: "1",
    updatedAt: "1",
    name: "Moscow",
  },
  {
    id: "2",
    createdAt: "1",
    updatedAt: "1",
    name: "Ivanovo",
  },
  {
    id: "3",
    createdAt: "1",
    updatedAt: "1",
    name: "Vladimir",
  },
  {
    id: "4",
    createdAt: "1",
    updatedAt: "1",
    name: "Saratov",
  },
]

export const useCities = createUseQuery("cities", () =>
  axios
    .get<City[]>("/cities")
    .then((res) => res.data)
    .catch(() => mockedData)
)
