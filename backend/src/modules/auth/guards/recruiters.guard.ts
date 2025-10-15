import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"

import { UserRole } from "@/modules/users/entities/user.entity"
import { ICurrentUser } from "../interfaces/current-user.interface"

@Injectable()
export class RecruitersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user as ICurrentUser | undefined

    return user?.role === UserRole.Recruiter
  }
}
