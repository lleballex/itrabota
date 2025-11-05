import { UserRole } from "@/modules/users/types/user-role"

export interface ICurrentUser {
  id: string
  role: UserRole
}
