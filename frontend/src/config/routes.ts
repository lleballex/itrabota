import { UserRole } from "@/types/entities/user"
import type { User } from "@/types/entities/user"

export const Routes = {
  home: "/",

  login: "/auth/login",
  register: "/auth/register",

  recruiter: {
    profile: "/recruiter/profile",
    newVacancy: "/recruiter/new-vacancy",
    vacancies: "/recruiter/vacancies",
    vacancy: (id: string) => `/recruiter/vacancies/${id}`,
    editVacancy: (id: string) => `/recruiter/vacancies/${id}/edit`,
    applications: "/recruiter/applications",
    application: (id: string) => `/recruiter/applications/${id}`,
    notifications: "/recruiter/notifications",
    candidates: "/recruiter/candidates",
    candidate: (id: string) => `/recruiter/candidates/${id}`,
    calendar: "/recruiter/calendar",
  },

  candidate: {
    profile: "/candidate/profile",
    vacancies: "/candidate/vacancies",
    vacancy: (id: string, options?: { tab?: "vacancy" | "application" }) => {
      const url = `/candidate/vacancies/${id}`
      if (options?.tab) {
        return `${url}?tab=${options.tab}`
      }
      return url
    },
    applications: "/candidate/applications",
    notifications: "/candidate/notifications",
    calendar: "/candidate/calendar",
  },
}

export const getFilledProfileEntryRouteByRole = (role: UserRole) =>
  ({
    [UserRole.Recruiter]: Routes.recruiter.vacancies,
    [UserRole.Candidate]: Routes.candidate.vacancies,
  })[role]

export const getProfileRouteByRole = (role: UserRole) =>
  ({
    [UserRole.Recruiter]: Routes.recruiter.profile,
    [UserRole.Candidate]: Routes.candidate.profile,
  })[role]

export const getEntryRouteForUser = (user: User) => {
  const profile = {
    [UserRole.Recruiter]: user.recruiter,
    [UserRole.Candidate]: user.candidate,
  }[user.role]

  return profile
    ? getFilledProfileEntryRouteByRole(user.role)
    : getProfileRouteByRole(user.role)
}
