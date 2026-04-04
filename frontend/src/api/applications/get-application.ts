import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { Application } from "@/types/entities/application"

// TODO: only for recruiter now

interface Params {
  id: string
}

export const useApplication = createUseQuery("applications", ({ id }: Params) =>
  axios
    .get<Application>(`/applications/recruiter/${id}`)
    .then((res) => res.data),
)
