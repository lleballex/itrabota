import { BaseEntity } from "./base-entity"
import { Candidate } from "./candidate"
import { Recruiter } from "./recruiter"

export const UserRole = {
  Recruiter: "recruiter",
  Candidate: "candidate",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const UserRoles: Record<UserRole, string> = {
  [UserRole.Recruiter]: "Рекрутер",
  [UserRole.Candidate]: "Соискатель",
}

export interface User extends BaseEntity {
  email: string
  role: UserRole
  passwordChangedAt: string | null
  candidate?: Candidate | null
  recruiter?: Recruiter | null
}
