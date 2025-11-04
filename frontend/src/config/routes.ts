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
  },

  candidate: {
    profile: "/candidate/profile",
    vacancies: "/candidate/vacancies",
    vacancy: (id: string) => `/candidate/vacancies/${id}`,
  },
}
