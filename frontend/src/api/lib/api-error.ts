import { AxiosError } from "axios"

export interface ApiError {
  message: string
  fields?: { key: string; message: string }[]
  statusCode: number
}

export const transformErrorToApiError = (error: Error) => {
  let apiError: ApiError

  if (error instanceof AxiosError) {
    apiError = transformAxiosErrorToApiError(error) ?? {
      message: getFallbackAxiosErrorMessage(error),
      statusCode: error.status ?? 500,
    }
  } else {
    console.error(error)

    apiError = {
      message: "Что-то пошло не так",
      statusCode: 500,
    }
  }

  return apiError
}

const transformAxiosErrorToApiError = (e: AxiosError): ApiError | null => {
  const data = e.response?.data

  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    (typeof data.message === "string" || Array.isArray(data.message))
  ) {
    let fields: ApiError["fields"]

    if ("fields" in data && isApiErrorFields(data.fields)) {
      fields = data.fields
    }

    return {
      message: normalizeApiMessage(data.message),
      statusCode: e.response!.status,
      fields,
    }
  }

  return null
}

const normalizeApiMessage = (message: string | unknown[]) => {
  if (Array.isArray(message)) {
    return "Проверьте правильность заполнения полей"
  }

  return translateKnownApiMessage(message)
}

const getFallbackAxiosErrorMessage = (error: AxiosError) => {
  if (!error.response) {
    return "Не удалось подключиться к серверу"
  }

  return "Что-то пошло не так"
}

const translateKnownApiMessage = (message: string) => {
  const messages: Record<string, string> = {
    "Bad Request": "Некорректный запрос",
    Forbidden: "Доступ запрещен",
    "Internal server error": "Что-то пошло не так",
    "Not Found": "Не найдено",
    Unauthorized: "Нужно войти в аккаунт",
  }

  return messages[message] ?? message
}

const isApiErrorFields = (data: unknown): data is ApiError["fields"] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item: unknown) =>
        item &&
        typeof item === "object" &&
        "key" in item &&
        typeof item.key === "string" &&
        "message" in item &&
        typeof item.message === "string"
    )
  )
}
