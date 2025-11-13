import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { Application } from "@/types/entities/application"
import { AxiosError } from "axios"

interface Params {
  vacancyId: string
}

export const useMyApplication = createUseQuery(
  "applications",
  ({ vacancyId }: Params) =>
    axios
      .get<Application>(`/vacancies/${vacancyId}/applications/me`)
      .then((res) => res.data)
      .catch((e) => {
        if (e instanceof AxiosError && e.status === 404) {
          return null
        }
        throw e
      }),
  {
    retry: false,
  }
)
