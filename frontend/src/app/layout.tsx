"use client"

import { ReactNode } from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ru"

import Toasts from "@/components/special/Toasts"

import "./_styles/index.css"

interface Props {
  children?: ReactNode
}

dayjs.locale("ru")

const queryClient = new QueryClient()

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru" className="text-fg">
      <head>
        <title>айтиработа.рф</title>
      </head>
      <body className="flex flex-col min-h-[100dvh] text-fg text-base bg-bg">
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
          <Toasts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
