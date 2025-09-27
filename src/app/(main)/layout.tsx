import { ReactNode } from "react"

import MainLayoutSidebar from "./_components/MainLayoutSidebar"
import MainLayoutHeader from "./_components/MainLayoutHeader"

interface Props {
  children?: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex gap-5">
      <MainLayoutSidebar className="sticky top-3 h-[calc(100dvh-var(--spacing)*6)] min-w-[230px]" />
      <div className="flex flex-col gap-4 grow">
        <MainLayoutHeader className="sticky top-3" />
        <main className="grow">{children}</main>
      </div>
    </div>
  )
}
