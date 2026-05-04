import { createUseMutation } from "@/api/lib/create-use-mutation"
import { axios } from "@/api/lib/axios"
import { Vacancy } from "@/types/entities/vacancy"

interface Data {
  id: string
}

export const useRestoreVacancy = createUseMutation(
  ({ id }: Data) =>
    axios.post<Vacancy>(`/vacancies/${id}/restore`).then((res) => res.data),
  { invalidateQueries: ["vacancies", "applications"] },
)
