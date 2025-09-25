import { Errors } from "@/config/errors"
import { FormError } from "@/types/form-error"

const getFormErrorMessage = (error: FormError) => {
  const message = typeof error === "string" ? error : error.message

  if (message && message in Errors) {
    return Errors[message as keyof typeof Errors]
  }

  return message ?? Errors.ERROR
}

export const useFormError = (error?: FormError) => {
  if (!error) return null

  const message = getFormErrorMessage(error)

  return { message }
}
