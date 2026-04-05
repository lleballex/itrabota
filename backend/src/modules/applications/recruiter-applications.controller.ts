import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { CreateRecruiterApplicationDto } from "./dto/create-recruiter-application.dto"
import { RejectApplicationDto } from "./dto/reject-application.dto"
import { RecruiterApplicationsService } from "./recruiter-applications.service"
import { GetRecruiterApplicationsDto } from "./dto/get-recruiter-applications.dto"
import { OfferRecruiterApplicationDto } from "./dto/offer-recruiter-application"

@Controller("applications/recruiter")
@Auth(UserRole.Recruiter)
export class RecruiterApplicationsController {
  constructor(
    private readonly recruiterApplicationsService: RecruiterApplicationsService,
  ) {}

  @Get()
  findAll(
    @Query() query: GetRecruiterApplicationsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.recruiterApplicationsService.findAll(query, user)
  }

  @Post()
  create(
    @Body() body: CreateRecruiterApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.recruiterApplicationsService.create(body, user)
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: ICurrentUser) {
    return this.recruiterApplicationsService.findOneById(id, user)
  }

  @Post(":id/reject")
  reject(
    @Param("id") id: string,
    @Body() body: RejectApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.recruiterApplicationsService.rejectById(id, body, user)
  }

  @Post(":id/offer")
  approve(
    @Param("id") id: string,
    @Body() body: OfferRecruiterApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.recruiterApplicationsService.offerById(id, body, user)
  }
}
