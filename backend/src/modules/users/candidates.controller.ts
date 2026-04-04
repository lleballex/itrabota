import { Controller, Get, Param, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"

import { UserRole } from "./types/user-role"
import { CandidatesService } from "./candidates.service"
import { GetRecruiterCandidatesDto } from "./dto/get-recruiter-candidates.dto"

@Controller("candidates")
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get("recruiter")
  @Auth(UserRole.Recruiter)
  findAllForRecruiter(
    @Query() query: GetRecruiterCandidatesDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidatesService.findAllForRecruiter(user, query)
  }

  @Get("recruiter/:id")
  @Auth(UserRole.Recruiter)
  findOneForRecruiter(
    @Param("id") id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidatesService.findOneForRecruiterById(id, user)
  }
}
