import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Industry } from "@/types/entities/industry"

export const useIndustries = createUseQuery("industries", () =>
  axios.get<Industry[]>("/industries").then((res) => res.data)
)
