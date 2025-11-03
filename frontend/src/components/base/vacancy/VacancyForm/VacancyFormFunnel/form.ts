import { FieldPath } from "react-hook-form"

import { FormInputValues } from "../form"

// TODO: what to do with array

export const formFields: FieldPath<FormInputValues>[] = [
  "funnelSteps",
  "funnelSteps.0",
  "funnelSteps.0.name",
  "funnelSteps.0.approveMessage",
  "funnelSteps.0.rejectMessage",
  "funnelSteps.0.shouldCreateCall",
]
