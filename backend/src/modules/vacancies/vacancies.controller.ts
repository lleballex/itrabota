import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"

import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { UserRole } from "@/modules/users/entities/user.entity"

import { VacanciesService } from "./vacancies.service"
import { CreateVacancyDto } from "./dto/create-vacancy.dto"
import { GetRecruiterVacanciesDto } from "./dto/get-recruiter-vacancies.dto"

@Controller("vacancies")
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get("recruiter")
  @Auth(UserRole.Recruiter)
  findAllForRecruiter(
    @Query() query: GetRecruiterVacanciesDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.vacanciesService.findAllForRecruiter(query, user)
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
}
