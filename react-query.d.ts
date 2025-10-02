import "@tanstack/react-query"

type QueryKey = "me" | "vacancies"

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: [QueryKey] | [QueryKey, unknown]
    mutationKey: []
  }
}
