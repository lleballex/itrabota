"use client"

import Link from "next/link"
import classNames from "classnames"
import { usePathname } from "next/navigation"

import { Routes } from "@/config/routes"
import Icon from "@/components/ui/Icon"
import HighlightList from "@/components/ui/HighlightList"

const RECRUITER_LINKS = [
  {
    url: Routes.recruiter.dashboard,
    title: "Дашборд",
    icon: <Icon icon="house" />,
  },
  {
    url: Routes.recruiter.vacancies,
    title: "Вакансии",
    icon: <Icon icon="files" />,
  },
  {
    url: Routes.recruiter.candidates,
    title: "Соискатели",
    icon: <Icon icon="users" />,
  },
]

interface Props {
  className?: string
}

export default function MainLayoutSidebar({ className }: Props) {
  const pathname = usePathname()

  const links = RECRUITER_LINKS

  return (
    <nav className={classNames(className, "p-2 border border-border rounded")}>
      <HighlightList.Root
        className="flex flex-col gap-1.5"
        highlightClassName="bg-primary rounded-[calc(var(--radius)-var(--spacing)*2)]"
      >
        {links.map((link) => (
          <HighlightList.Item key={link.url} active={pathname === link.url}>
            <Link
              className={classNames("flex items-center gap-1.5 p-1 px-1.5", {})}
              href={link.url}
            >
              {link.icon}
              {link.title}
            </Link>
          </HighlightList.Item>
        ))}
      </HighlightList.Root>
    </nav>
  )
}
