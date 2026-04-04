import { Controller, Get, Param, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { ApplicationsService } from "./applications.service"
import { GetApplicationsDto } from "./dto/get-applications.dto"

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get("recruiter")
  @Auth(UserRole.Recruiter)
  findAllForRecruiter(
    @Query() query: GetApplicationsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.applicationsService.findAllForRecruiter(query, user)
  }

  @Get("candidate")
  @Auth(UserRole.Candidate)
  findAllForCandidate(
    @Query() query: GetApplicationsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.applicationsService.findAllForCandidate(query, user)
  }

  @Get("recruiter/:id")
  @Auth(UserRole.Recruiter)
  findOneForRecruiter(
    @Param("id") id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.applicationsService.findOneForRecruiterById(id, user)
  }
}
