import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"

import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { UserRole } from "@/modules/users/types/user-role"
import { CreateApplicationDto } from "@/modules/applications/dto/create-application.dto"
import { ApplicationsService } from "@/modules/applications/applications.service"

import { VacanciesService } from "./vacancies.service"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { UpdateVacancyDto } from "./dto/update-vacancy-dto"
import { GetCandidateVacanciesDto } from "./dto/get-candidate-vacancies.dto"

@Controller("vacancies")
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get("recruiter")
  @Auth(UserRole.Recruiter)
  findAllForRecruiter(
    @Query() query: GetRecruiterVacanciesDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.vacanciesService.findAllForRecruiter(query, user)
  }

  @Get("candidate")
  @Auth(UserRole.Candidate)
  findAllForCandidate(
    @Query() query: GetCandidateVacanciesDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.vacanciesService.findAllForCandidate(query, user)
  }

  @Post()
  @Auth(UserRole.Recruiter)
  create(@Body() body: CreateVacancyDto, @CurrentUser() user: ICurrentUser) {
    return this.vacanciesService.create(body, user)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.vacanciesService.findOneById(id)
  }

  @Patch(":id")
  @Auth(UserRole.Recruiter)
  update(
    @Param("id") id: string,
    @Body() body: UpdateVacancyDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.vacanciesService.update(id, body, user)
  }

  @Post(":id/applications")
  @Auth(UserRole.Candidate)
  createApplication(
    @Param("id") id: string,
    @Body() body: CreateApplicationDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.applicationsService.create(body, id, user)
  }
}
