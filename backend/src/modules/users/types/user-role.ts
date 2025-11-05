export const UserRole = {
  Recruiter: "recruiter",
  Candidate: "candidate",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
