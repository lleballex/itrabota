export const Routes = {
  home: "/",

  login: "/auth/login",
  register: "/auth/register",

  recruiter: {
    profile: "/recruiter/profile",
    dashboard: "/recruiter",
    candidates: "/recruiter/candidates",
    newVacancy: "/recruiter/new-vacancy",
    vacancies: "/recruiter/vacancies",
    vacancy: (id: string) => `/recruiter/vacancies/${id}`,
    editVacancy: (id: string) => `/recruiter/vacancies/${id}/edit`,
  },

  candidate: {
    profile: "/candidate/profile",
  },
}
