import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { CreateCandidateApplicationDto } from "./dto/create-candidate-application.dto"
import { RejectApplicationDto } from "./dto/reject-application.dto"
import { CandidateApplicationsService } from "./candidate-applications.service"
import { GetCandidateApplicationsDto } from "./dto/get-candidate-applications.dto"
import { AcceptCandidateApplicationDto } from "./dto/accept-candidate-application.dto"

@Controller("applications/candidate")
@Auth(UserRole.Candidate)
export class CandidateApplicationsController {
  constructor(
    private readonly candidateApplicationsService: CandidateApplicationsService,
  ) {}

  @Get()
  findAll(
    @Query() query: GetCandidateApplicationsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidateApplicationsService.findAll(query, user)
  }

  @Post()
  create(
    @Body() body: CreateCandidateApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidateApplicationsService.create(body, user)
  }

  @Post(":id/reject")
  reject(
    @Param("id") id: string,
    @Body() body: RejectApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidateApplicationsService.rejectById(id, body, user)
  }

  @Post(":id/accept")
  accept(
    @Param("id") id: string,
    @Body() body: AcceptCandidateApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidateApplicationsService.acceptById(id, body, user)
  }
}
