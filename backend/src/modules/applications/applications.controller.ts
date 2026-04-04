import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { ApplicationsService } from "./applications.service"
import { GetApplicationsDto } from "./dto/get-applications.dto"
import { CreateCandidateApplicationDto } from "./dto/create-candidate-application.dto"
import { CreateRecruiterApplicationDto } from "./dto/create-recruiter-application.dto"

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post("candidate")
  @Auth(UserRole.Candidate)
  createByCandidate(
    @Body() body: CreateCandidateApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.applicationsService.createByCandidate(body, user)
  }

  @Post("recruiter")
  @Auth(UserRole.Recruiter)
  createByRecruiter(
    @Body() body: CreateRecruiterApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.applicationsService.createByRecruiter(body, user)
  }

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
