"use client"

import Link from "next/link"
import classNames from "classnames"
import { usePathname } from "next/navigation"

import { Routes } from "@/config/routes"
import Icon from "@/components/ui/Icon"

import styles from "./MainLayoutSidebar.module.css"

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

  console.log(pathname)

  return (
    <nav
      className={classNames(
        className,
        styles.container,
        "flex flex-col gap-1 p-2 border-base rounded"
      )}
    >
      {links.map((link) => (
        <Link
          className={classNames(
            styles.item,
            "flex items-center gap-1.5 p-1 px-1.5",
            {
              [styles.active]: pathname === link.url,
            }
          )}
          key={link.url}
          href={link.url}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
      <span
        className={classNames(
          styles.highlight,
          "bg-primary rounded-[calc(var(--radius)-var(--spacing)*2)] transition-all"
        )}
      />
    </nav>
  )
}
