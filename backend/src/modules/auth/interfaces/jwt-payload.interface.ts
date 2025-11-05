import { UserRole } from "@/modules/users/types/user-role"

export interface IJwtPayload {
  sub: string
  role: UserRole
}
