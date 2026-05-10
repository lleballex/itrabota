import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { ApplicationStageResult } from "@/types/entities/application-stage-result"

interface Params {
  applicationId: string
}

export const useApplicationStageResults = createUseQuery(
  "applications",
  ({ applicationId }: Params) =>
    axios
      .get<ApplicationStageResult[]>(
        `/applications/recruiter/${applicationId}/stage-results`,
      )
      .then((res) => res.data),
)
