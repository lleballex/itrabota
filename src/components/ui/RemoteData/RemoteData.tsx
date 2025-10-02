import { ReactNode } from "react"

import { RemoteData as IRemoteData } from "@/types/remote-data"
import Icon from "@/components/ui/Icon"

interface Props<D, E extends Error> {
  data: IRemoteData<D, E>
  onSuccess: (data: D) => ReactNode
}

export default function RemoteData<D, E extends Error>({
  data,
  onSuccess,
}: Props<D, E>) {
  if (data.status === "success") {
    return onSuccess(data.data)
  }

  if (data.status === "error") {
    return <p className="text-danger text-center">{data.error.message}</p>
  }

  // TODO: extract loader to separate component
  return <Icon className="mx-auto animate-spin" icon="loader" />
}
