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
    url: Routes.recruiter.vacancies,
    title: "Вакансии",
    icon: <Icon icon="files" />,
  },
  {
    url: Routes.recruiter.applications,
    title: "Отклики",
    icon: <Icon icon="messageSquare" />,
  },
  {
    url: Routes.recruiter.candidates,
    title: "Соискатели",
    icon: <Icon icon="users" />,
  },
  {
    url: Routes.recruiter.calendar,
    title: "Календарь",
    icon: <Icon icon="calendar" />,
  },
  {
    url: Routes.recruiter.notifications,
    title: "Уведомления",
    icon: <Icon icon="bell" />,
  },
]

const candidateLinks: SidebarLink[] = [
  {
    url: Routes.candidate.vacancies,
    title: "Вакансии",
    icon: <Icon icon="files" />,
  },
  {
    url: Routes.candidate.applications,
    title: "Отклики",
    icon: <Icon icon="messageSquare" />,
  },
  {
    url: Routes.candidate.profile,
    title: "Резюме",
    icon: <Icon icon="fileText" />,
  },
  {
    url: Routes.candidate.calendar,
    title: "Календарь",
    icon: <Icon icon="calendar" />,
  },
  {
    url: Routes.candidate.notifications,
    title: "Уведомления",
    icon: <Icon icon="bell" />,
  },
]

export const sidebarLinks = {
  [UserRole.Recruiter]: recruiterLinks,
  [UserRole.Candidate]: candidateLinks,
}
