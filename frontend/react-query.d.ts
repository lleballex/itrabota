import "@tanstack/react-query"

type QueryKey =
  | "me"
  | "vacancies"
  | "specializations"
  | "cities"
  | "industries"
  | "applications"

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: [QueryKey] | [QueryKey, unknown]
    mutationKey: []
  }
}
