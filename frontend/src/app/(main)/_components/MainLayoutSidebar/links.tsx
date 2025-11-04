import { ReactNode } from "react"

import { Routes } from "@/config/routes"
import Icon from "@/components/ui/Icon"
import { UserRole } from "@/types/entities/user"

interface SidebarLink {
  url: string
  title: string
  icon: ReactNode
}

const recruiterLinks: SidebarLink[] = [
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

const candidateLinks: SidebarLink[] = []

export const sidebarLinks = {
  [UserRole.Recruiter]: recruiterLinks,
  [UserRole.Candidate]: candidateLinks,
}
