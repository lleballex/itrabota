import { FieldValues, Path, UseFormReturn } from "react-hook-form"

import { ApiError } from "@/api/lib/api-error"

interface Args<Values extends FieldValues> {
  error: ApiError
  form: UseFormReturn<Values>
}

export const handleFormApiError = <Values extends FieldValues>({
  error,
  form,
}: Args<Values>): boolean => {
  if (error.fields?.length) {
    error.fields.forEach((field) => {
      form.setError(field.key as Path<Values>, { message: field.message })
    })
    return true
  }
  return false
}
