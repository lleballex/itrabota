import { Register, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useMemo } from "react"

import { useRemoteData } from "@/lib/use-remote-data"

type Options<D> = Omit<UseQueryOptions<D>, "queryKey" | "queryFn" | "enabled">

interface InlineOptions {
  isEnabled?: boolean
}

export const createUseQuery = <D, FA extends unknown[]>(
  key: Register["queryKey"][0],
  fetcher: (...args: FA) => Promise<D>,
  options?: Options<D>
) => {
  return (...args: FA | [...FA, InlineOptions]) => {
    const { fetcherArgs, inlineOptions } = useMemo(() => {
      if (args.length === fetcher.length) {
        return {
          fetcherArgs: args as FA,
          inlineOptions: undefined,
        }
      } else {
        return {
          fetcherArgs: args.slice(0, args.length - 1) as FA,
          inlineOptions: args[args.length - 1] as InlineOptions,
        }
      }
    }, [args])

    const { status, data, error } = useQuery<D>({
      queryKey: [key, fetcherArgs],
      queryFn: () => fetcher(...fetcherArgs),
      enabled: inlineOptions?.isEnabled,
      ...options,
    })

    const remoteData = useRemoteData({ status, data, error })

    return remoteData
  }
}
