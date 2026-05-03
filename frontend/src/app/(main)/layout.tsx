import { ReactNode } from "react"

import MainLayoutSidebar from "./_components/MainLayoutSidebar"
import MainLayoutHeader from "./_components/MainLayoutHeader"

interface Props {
  children?: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex my-[var(--spacing-screen)]">
      <MainLayoutSidebar className="ml-[var(--spacing-screen)] sticky top-[var(--spacing-screen)] h-[calc(100dvh-var(--spacing-screen)*2)] min-w-[230px]" />
      <div className="flex flex-col gap-5 grow">
        <MainLayoutHeader className="ml-[var(--spacing-content)] mr-[var(--spacing-screen)] sticky top-[var(--spacing-screen)] z-10" />
        <main className="grow mx-[var(--spacing-content)]">{children}</main>
      </div>
    </div>
  )
}
