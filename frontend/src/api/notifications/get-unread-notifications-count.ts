import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"

interface UnreadNotificationsCount {
  count: number
}

export const useUnreadNotificationsCount = createUseQuery(
  "notificationsUnreadCount",
  async () => {
    const res = await axios.get<UnreadNotificationsCount>(
      "/notifications/unread-count",
    )

    return res.data
  },
  { refetchInterval: 30000 },
)
