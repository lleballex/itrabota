import { FieldPath } from "react-hook-form"

import { FormInputValues } from "../form"

export const formFields: FieldPath<FormInputValues>[] = [
  "title",
  "specializationId",
  "employmentType",
  "format",
  "schedule",
  "workExperience",
  "cityId",
  "salaryFrom",
  "salaryTo",
  "description",
  "requirements",
  "conditions",
  "niceToHave",
  "responsibilities",
]
