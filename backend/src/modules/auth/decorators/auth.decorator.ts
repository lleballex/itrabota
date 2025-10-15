import { applyDecorators, UseGuards } from "@nestjs/common"

import { UserRole } from "@/modules/users/entities/user.entity"

import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RecruitersGuard } from "../guards/recruiters.guard"

export const Auth = (role?: UserRole) => {
  if (!role) {
    return applyDecorators(UseGuards(JwtAuthGuard))
  } else if (role === UserRole.Recruiter) {
    return applyDecorators(UseGuards(JwtAuthGuard, RecruitersGuard))
  } else {
    throw new Error(`Unsupported role for Auth decorator: ${role}`)
  }
}
