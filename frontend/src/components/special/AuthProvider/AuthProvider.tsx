"use client"

import { useRouter } from "next/navigation"
import { FC, useMemo } from "react"

import { useMe } from "@/api/auth/get-me"
import { Routes } from "@/config/routes"
import { User, UserRole } from "@/types/entities/user"
import Icon from "@/components/ui/Icon"

interface Props {
  roles?: UserRole[]
  allowNoProfile?: boolean
  Component: FC<{ me: User }>
}

export default function AuthProvider({
  roles,
  allowNoProfile,
  Component,
}: Props) {
  const router = useRouter()

  const me = useMe()

  const children = useMemo(() => {
    if (me.status === "success") {
      if (!roles || roles.includes(me.data.role)) {
        if (!me.data.recruiter && !me.data.candidate && !allowNoProfile) {
          // TODO: check profile by the role
          // TODO: toast
          router.push(
            {
              [UserRole.Recruiter]: Routes.recruiter.profile,
              [UserRole.Candidate]: Routes.candidate.profile,
            }[me.data.role]
          )
          return null
        }

        return <Component me={me.data} />
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
  }, [Component, me, roles, router, allowNoProfile])

  return children
}

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Icon className="animate-spin" icon="loader" />
    </div>
  )
}
