import {
  MutationFunctionContext,
  Register,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { ApiError, transformErrorToApiError } from "@/api/lib/api-error"
import { useToastsStore } from "@/stores/toasts"

interface InlineOptions {
  onError?: (error: ApiError) => boolean
  onSuccess?: () => void
  onSettles?: () => void
}

type QueryKeyPrefix = Register["queryKey"][0]

interface Options<D, MA> {
  invalidateQueries?:
    | QueryKeyPrefix[]
    | ((data: D, args: MA) => QueryKeyPrefix[] | undefined)
}

export const createUseMutation = <D, MA = void>(
  mutation: (args: MA, ctx: MutationFunctionContext) => Promise<D>,
  options?: Options<D, MA>,
) => {
  return () => {
    const { addToast } = useToastsStore()
    const queryClient = useQueryClient()

    const { mutate: mutate_, status } = useMutation<D, Error, MA>({
      mutationFn: (args, ctx) => mutation(args, ctx),
    })

    const mutate = (data: MA, inlineOptions?: InlineOptions) => {
      mutate_(data, {
        ...inlineOptions,
        onSuccess: async (res, args) => {
          const invalidateQueries =
            typeof options?.invalidateQueries === "function"
              ? options.invalidateQueries(res, args)
              : options?.invalidateQueries

          await Promise.all(
            invalidateQueries?.map((key) =>
              queryClient.invalidateQueries({ queryKey: [key] }),
            ) ?? [],
          )

          inlineOptions?.onSuccess?.()
        },
        onError: (error) => {
          const apiError = transformErrorToApiError(error)

          if (!inlineOptions?.onError?.(apiError)) {
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
