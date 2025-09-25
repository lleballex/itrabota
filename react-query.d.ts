import "@tanstack/react-query"

type QueryKey = "me"

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: [QueryKey] | [QueryKey, unknown]
    mutationKey: []
  }
}
