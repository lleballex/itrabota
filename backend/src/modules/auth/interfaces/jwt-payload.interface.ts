import { UserRole } from "@/modules/users/entities/user.entity"

export interface IJwtPayload {
  sub: string
  role: UserRole
}
