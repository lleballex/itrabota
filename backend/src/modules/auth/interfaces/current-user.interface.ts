import { UserRole } from "@/modules/users/entities/user.entity"

export interface ICurrentUser {
  id: string
  role: UserRole
}
