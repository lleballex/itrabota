import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Vacancy } from "@/types/entities/vacancy"

interface Params {
  id: string
}

export const useVacancy = createUseQuery(
  "vacancies",
  ({ id, ...params }: Params) =>
    axios.get<Vacancy>(`/vacancies/${id}`, { params }).then((res) => res.data)
)
