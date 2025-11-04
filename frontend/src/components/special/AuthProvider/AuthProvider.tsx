"use client"

import { useRouter } from "next/navigation"
import { FC, ReactNode, useEffect, useState } from "react"

import { useMe } from "@/api/auth/get-me"
import { Routes } from "@/config/routes"
import { User, UserRole } from "@/types/entities/user"
import Icon from "@/components/ui/Icon"
import { useToastsStore } from "@/stores/toasts"

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

  const { addToast } = useToastsStore()

  const me = useMe()

  const [children, setChildren] = useState<ReactNode>(null)

  useEffect(() => {
    if (me.status === "success") {
      if (!roles || roles.includes(me.data.role)) {
        const profile = {
          [UserRole.Recruiter]: me.data.recruiter,
          [UserRole.Candidate]: me.data.candidate,
        }[me.data.role]

        if (!profile && !allowNoProfile) {
          addToast({
            type: "danger",
            message: "Необходимо заполнить данные профиля",
          })
          router.push(
            {
              [UserRole.Recruiter]: Routes.recruiter.profile,
              [UserRole.Candidate]: Routes.candidate.profile,
            }[me.data.role]
          )
          setChildren(null)
        } else {
          setChildren(<Component me={me.data} />)
        }
      } else {
        addToast({
          type: "danger",
          message: "Доступ к странице запрещен",
        })
        router.push(Routes.home)
        setChildren(null)
      }
    } else if (me.status === "error") {
      addToast({
        type: "danger",
        message: "Необходимо войти в аккаунт",
      })
      router.push(Routes.login)
      setChildren(null)
    } else {
      setChildren(<Loader />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, roles, allowNoProfile, Component])

  return children
}

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Icon className="animate-spin" icon="loader" />
    </div>
  )
}
