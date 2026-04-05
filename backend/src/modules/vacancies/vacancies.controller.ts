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
import { CandidateApplicationsService } from "@/modules/applications/candidate-applications.service"
import { RecruiterApplicationsService } from "@/modules/applications/recruiter-applications.service"

import { VacanciesService } from "./vacancies.service"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"
import { UpdateVacancyDto } from "./dto/update-vacancy-dto"
import { GetCandidateVacanciesDto } from "./dto/get-candidate-vacancies.dto"

@Controller("vacancies")
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly candidateApplicationsService: CandidateApplicationsService,
    private readonly recruiterApplicationsService: RecruiterApplicationsService,
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

  @Get(":id/applications")
  @Auth(UserRole.Recruiter)
  getAllApplications(
    @Param("id") id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.recruiterApplicationsService.findAll({ vacancyId: id }, user)
  }

  @Get(":id/applications/me")
  @Auth(UserRole.Candidate)
  findMyApplication(
    @Param("id") id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.candidateApplicationsService.findOneByVacancyId(id, user)
  }
}
