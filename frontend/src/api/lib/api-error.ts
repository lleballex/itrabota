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
      message: error.message,
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
    typeof data.message === "string"
  ) {
    let fields: ApiError["fields"]

    if ("fields" in data && isApiErrorFields(data.fields)) {
      fields = data.fields
    }

    return {
      message: data.message,
      statusCode: e.response!.status,
      fields,
    }
  }

  return null
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
