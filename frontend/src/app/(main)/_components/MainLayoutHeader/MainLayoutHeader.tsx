"use client"

import Link from "next/link"
import classNames from "classnames"

import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"
import { useMe } from "@/api/auth/get-me"

import MainLayoutHeaderUser from "./MainLayoutHeaderUser"

interface Props {
  className?: string
}

export default function MainLayoutHeader({ className }: Props) {
  const me = useMe()

  return (
    <header
      className={classNames(className, "flex items-center justify-between")}
    >
      <Link href={Routes.home}>
        <h1 className="text-h2 font-extrabold">
          айтиработа
          <span className="text-primary">.рф</span>
        </h1>
      </Link>

      {me.status === "success" ? (
        <MainLayoutHeaderUser user={me.data} />
      ) : (
        <Button type="glass" link={{ url: Routes.login }}>
          Войти
        </Button>
      )}
    </header>
  )
}
