import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Candidate } from "@/types/entities/candidate"

interface Params {
  vacancyId: string
}

export const useMatchedVacancyCandidates = createUseQuery(
  "vacancies",
  ({ vacancyId }: Params) =>
    axios
      .get<Candidate[]>(`/vacancies/${vacancyId}/matched-candidates`)
      .then((res) => res.data),
)
