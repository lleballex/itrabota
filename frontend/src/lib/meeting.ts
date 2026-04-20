import dayjs from "dayjs"

export const MEETING_TIMEZONE = "Europe/Moscow"

export const formatMeetingDateTime = (date: string) =>
  dayjs.utc(date).tz(MEETING_TIMEZONE).format("D MMMM HH:mm")

export const formatMeetingTimeRange = (startsAt: string, endsAt: string) =>
  `${dayjs.utc(startsAt).tz(MEETING_TIMEZONE).format("HH:mm")} - ${dayjs
    .utc(endsAt)
    .tz(MEETING_TIMEZONE)
    .format("HH:mm")}`
