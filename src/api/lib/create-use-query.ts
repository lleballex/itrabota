import { Register, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { useRemoteData } from "@/lib/use-remote-data"

interface Options {
  isEnabled?: boolean
}

export const createUseQuery = <D, FA extends unknown[]>(
  key: Register["queryKey"][0],
  fetcher: (...args: FA) => Promise<D>
) => {
  return (...args: FA | [...FA, Options]) => {
    const { fetcherArgs, options } = useMemo(() => {
      if (args.length === fetcher.length) {
        return {
          fetcherArgs: args as FA,
          options: undefined,
        }
      } else {
        return {
          fetcherArgs: args.slice(0, args.length - 1) as FA,
          options: args[args.length - 1] as Options,
        }
      }
    }, [args])

    const { status, data, error } = useQuery<D>({
      queryKey: [key, fetcherArgs],
      queryFn: () => fetcher(...fetcherArgs),
      enabled: options?.isEnabled,
    })

    const remoteData = useRemoteData({ status, data, error })

    return remoteData
  }
}
