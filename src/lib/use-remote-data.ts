import { useEffect, useState } from "react"

import { RemoteData } from "@/types/remote-data"

interface Args<D, E extends Error> {
  status: "pending" | "success" | "error"
  data: D | undefined
  error: E | null | undefined
}

export const useRemoteData = <D, E extends Error>({
  status,
  data,
  error,
}: Args<D, E>) => {
  const [remoteData, setRemoteData] = useState<RemoteData<D, E>>({
    status: "initial",
  })

  useEffect(() => {
    if (status === "pending") {
      setRemoteData({ status: "pending" })
    } else if (status === "success" && data) {
      setRemoteData({ status: "success", data })
    } else if (status === "error" && error) {
      setRemoteData({ status: "error", error })
    } else {
      throw new Error("Status, data and error are not consistent")
    }
  }, [status, data, error])

  return remoteData
}
