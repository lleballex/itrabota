import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Skill } from "@/types/entities/skill"

export const useSkills = createUseQuery("skills", () =>
  axios
    .get<Skill[]>("/skills")
    .then((res) => res.data)
    .catch(() => [])
)
