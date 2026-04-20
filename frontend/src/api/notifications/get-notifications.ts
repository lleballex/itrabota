import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"
import { Notification } from "@/types/entities/notification"

interface Params {
  limit?: number
}

export const useNotifications = createUseQuery(
  "notifications",
  async (params?: Params) => {
    const res = await axios.get<Notification[]>("/notifications", {
      params,
    })

    return res.data
  },
)
