export const Routes = {
  home: "/",

  login: "/auth/login",
  register: "/auth/register",

  recruiter: {
    profile: "/recruiter/profile",
    dashboard: "/recruiter",
    vacancies: "/recruiter/vacancies",
    vacancy: (id: string) => `/recruiter/vacancies/${id}`,
    candidates: "/recruiter/candidates",
  },

  candidate: {
    profile: "/candidate/profile",
  },
}
