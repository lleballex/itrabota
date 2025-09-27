"use client"

import { useRouter } from "next/navigation"
import { cloneElement, ReactElement, useMemo } from "react"

import { useMe } from "@/api/me/me"
import { Routes } from "@/config/routes"
import { User, UserRole } from "@/types/entities/user"
import Icon from "@/components/ui/Icon"

interface Props {
  roles?: UserRole[]
  children?: ReactElement<{ me: User }>
}

export default function AuthProvider({ roles, children: children_ }: Props) {
  const router = useRouter()

  const me = useMe()

  const children = useMemo(() => {
    if (!children_) return null

    if (me.status === "success") {
      if (!roles || roles.includes(me.data.role)) {
        return cloneElement(children_, {
          me: me.data,
        })
      } else {
        // TODO: toast
        router.push(Routes.login)
        return null
      }
    } else if (me.status === "error") {
      // TODO: toast
      router.push(Routes.login)
      return null
    } else {
      return <Loader />
    }
  }, [children_, me, roles, router])

  return children
}

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Icon className="animate-spin" icon="loader" />
    </div>
  )
}
