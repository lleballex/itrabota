import { applyDecorators, UseGuards } from "@nestjs/common"

import { UserRole } from "@/modules/users/types/user-role"

import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RecruitersGuard } from "../guards/recruiters.guard"
import { CandidatesGuard } from "../guards/candidates.guard"

export const Auth = (role?: UserRole) => {
  if (!role) {
    return applyDecorators(UseGuards(JwtAuthGuard))
  } else if (role === UserRole.Recruiter) {
    return applyDecorators(UseGuards(JwtAuthGuard, RecruitersGuard))
  } else if (role === UserRole.Candidate) {
    return applyDecorators(UseGuards(JwtAuthGuard, CandidatesGuard))
  } else {
    throw new Error(`Unsupported role for Auth decorator: ${role}`)
  }
}
