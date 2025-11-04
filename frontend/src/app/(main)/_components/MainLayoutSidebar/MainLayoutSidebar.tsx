"use client"

import Link from "next/link"
import classNames from "classnames"
import { usePathname } from "next/navigation"

import HighlightList from "@/components/ui/HighlightList"
import { useMe } from "@/api/auth/get-me"
import RemoteData from "@/components/ui/RemoteData"

import { sidebarLinks } from "./links"

interface Props {
  className?: string
}

export default function MainLayoutSidebar({ className }: Props) {
  const pathname = usePathname()

  const me = useMe()

  return (
    <nav className={classNames(className, "p-2 border border-border rounded")}>
      {/* TODO: center loader */}
      <RemoteData
        data={me}
        onSuccess={(me) => (
          <HighlightList.Root
            className="flex flex-col gap-1.5"
            highlightClassName="bg-primary rounded-[calc(var(--radius)-var(--spacing)*2)]"
          >
            {sidebarLinks[me.role].map((link) => (
              <HighlightList.Item key={link.url} active={pathname === link.url}>
                <Link
                  className="flex items-center gap-1.5 p-1 px-1.5"
                  href={link.url}
                >
                  {link.icon}
                  {link.title}
                </Link>
              </HighlightList.Item>
            ))}
          </HighlightList.Root>
        )}
      />
    </nav>
  )
}
