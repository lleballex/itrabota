import { MutationFunctionContext, useMutation } from "@tanstack/react-query"

import { ApiError, transformErrorToApiError } from "@/api/lib/api-error"

interface InlineOptions {
  onError?: (error: ApiError) => boolean
  onSuccess?: () => void
  onSettles?: () => void
}

export const createUseMutation = <D, MA>(
  mutation: (args: MA, ctx: MutationFunctionContext) => Promise<D>
) => {
  return () => {
    const { mutate: mutate_, status } = useMutation<D, Error, MA>({
      mutationFn: (args, ctx) => mutation(args, ctx),
    })

    const mutate = (data: MA, options?: InlineOptions) => {
      mutate_(data, {
        ...options,
        onError: (error) => {
          const apiError = transformErrorToApiError(error)

          if (!options?.onError?.(apiError)) {
            alert(apiError.message) // TODO: toast instead of alert
          }
        },
      })
    }

    return { mutate, status }
  }
}
