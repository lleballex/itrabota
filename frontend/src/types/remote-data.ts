export type RemoteData<D, E extends Error> =
  | { status: "initial" }
  | { status: "pending" }
  | {
      status: "success"
      data: D
    }
  | {
      status: "error"
      error: E
    }
