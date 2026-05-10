import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"
import {
  ApplicationStageRecommendation,
  ApplicationStageResult,
} from "@/types/entities/application-stage-result"

interface Data {
  applicationId: string
  summary?: string | null
  pros?: string | null
  cons?: string | null
  notes?: string | null
  recommendation?: ApplicationStageRecommendation | null
}

export const useUpsertCurrentApplicationStageResult = createUseMutation(
  ({ applicationId, ...data }: Data) =>
    axios
      .put<ApplicationStageResult>(
        `/applications/recruiter/${applicationId}/stage-results/current`,
        data,
      )
      .then((res) => res.data),
  { invalidateQueries: ["applications"] },
)
