"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useQueryState<T extends string>(
  key: string,
  values: readonly T[],
  defaultValue: T,
) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const value = useMemo(() => {
    const param = searchParams.get(key)

    return values.includes(param as T) ? (param as T) : defaultValue
  }, [defaultValue, key, searchParams, values])

  const setValue = useCallback(
    (nextValue: T) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set(key, nextValue)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [key, pathname, router, searchParams],
  )

  return [value, setValue] as const
}
