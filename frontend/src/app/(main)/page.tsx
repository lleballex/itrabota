import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { Routes, getEntryRouteForUser } from "@/config/routes"
import type { User } from "@/types/entities/user"

const getMe = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    return null
  }

  const cookieStore = await cookies()

  const response = await fetch(`${apiUrl}/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as User
}

export default async function HomePage() {
  const me = await getMe()

  if (!me) {
    redirect(Routes.login)
  }

  redirect(getEntryRouteForUser(me))
}
