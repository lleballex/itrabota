import { axios } from "@/api/lib/axios"
import { createUseQuery } from "@/api/lib/create-use-query"

export interface MeetingSlot {
  startsAt: string
  endsAt: string
}

interface Params {
  applicationId: string
  date: string | null
  refreshKey?: number
}

export const useMeetingSlots = createUseQuery(
  "meetingSlots",
  async ({ applicationId, date }: Params) => {
    if (!date) {
      return []
    }

    const res = await axios.get<MeetingSlot[]>(
      `/meetings/candidate/application/${applicationId}/slots`,
      {
        params: { date },
      },
    )

    return res.data
  },
)
