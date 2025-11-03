import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "@/modules/users/users.module"

import { Vacancy } from "./entities/vacancy.entity"
import { VacanciesService } from "./vacancies.service"
import { VacanciesController } from "./vacancies.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy]), UsersModule],
  providers: [VacanciesService],
  controllers: [VacanciesController],
})
export class VacanciesModule {}
