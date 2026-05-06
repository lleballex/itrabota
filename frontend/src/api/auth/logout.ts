import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { axios } from "@/api/lib/axios"
import { transformErrorToApiError } from "@/api/lib/api-error"
import { Routes } from "@/config/routes"
import { useAuthTransitionStore } from "@/stores/auth-transition"
import { useToastsStore } from "@/stores/toasts"

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { addToast } = useToastsStore()
  const { finishLogout, startLogout } = useAuthTransitionStore()

  const { mutate: mutate_, status } = useMutation({
    mutationFn: () => axios.post("/auth/logout"),
  })

  const mutate = () => {
    startLogout()
    router.replace(Routes.login)

    mutate_(undefined, {
      onSuccess: () => {
        queryClient.clear()
      },
      onError: (error) => {
        const apiError = transformErrorToApiError(error)

        finishLogout()
        router.replace(Routes.home)
        addToast({
          message: apiError.message,
          type: "danger",
        })
      },
    })
  }

  return { mutate, status }
}
