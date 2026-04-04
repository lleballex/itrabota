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
    candidates: "/recruiter/candidates",
    candidate: (id: string) => `/recruiter/candidates/${id}`,
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
  },
}
