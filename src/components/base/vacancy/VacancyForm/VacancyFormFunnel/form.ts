import { FieldPath } from "react-hook-form"

import { FormInputValues } from "../form"

export const formFields: FieldPath<FormInputValues>[] = [
  "funnel",
  "funnel.0",
  "funnel.0.name",
  "funnel.0.approveMessage",
  "funnel.0.rejectMessage",
  "funnel.0.shouldCreateCall",
]
