import "@tanstack/react-query"

type QueryKey =
  | "me"
  | "vacancies"
  | "specializations"
  | "cities"
  | "industries"
  | "applications"
  | "candidates"
  | "meetings"
  | "meetingSlots"
  | "notifications"
  | "notificationsUnreadCount"

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: [QueryKey] | [QueryKey, unknown]
    mutationKey: []
  }
}
