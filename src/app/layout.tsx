import { ReactNode } from "react"

import "./_styles/index.css"

interface Props {
  children?: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru" className="text-fg">
      <head>
        <title>айтиработа.рф</title>
      </head>
      <body className="flex flex-col min-h-[100dvh] p-3 text-fg text-base bg-bg">
        {children}
      </body>
    </html>
  )
}
