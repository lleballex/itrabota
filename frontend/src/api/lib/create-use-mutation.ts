import { MutationFunctionContext, useMutation } from "@tanstack/react-query"

import { ApiError, transformErrorToApiError } from "@/api/lib/api-error"
import { useToastsStore } from "@/stores/toasts"

interface InlineOptions {
  onError?: (error: ApiError) => boolean
  onSuccess?: () => void
  onSettles?: () => void
}

export const createUseMutation = <D, MA = void>(
  mutation: (args: MA, ctx: MutationFunctionContext) => Promise<D>
) => {
  return () => {
    const { addToast } = useToastsStore()

    const { mutate: mutate_, status } = useMutation<D, Error, MA>({
      mutationFn: (args, ctx) => mutation(args, ctx),
    })

    const mutate = (data: MA, options?: InlineOptions) => {
      mutate_(data, {
        ...options,
        onError: (error) => {
          const apiError = transformErrorToApiError(error)

          if (!options?.onError?.(apiError)) {
            addToast({
              message: apiError.message,
              type: "danger",
            })
          }
        },
      })
    }

    return { mutate, status }
  }
}
