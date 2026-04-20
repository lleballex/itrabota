import { axios } from "@/api/lib/axios"
import { createUseMutation } from "@/api/lib/create-use-mutation"

interface ReadNotificationsData {
  ids: string[]
}

export const useReadNotifications = createUseMutation(
  async (data: ReadNotificationsData) => {
    const res = await axios.post<{ ids: string[] }>("/notifications/read", data)

    return res.data
  },
)
