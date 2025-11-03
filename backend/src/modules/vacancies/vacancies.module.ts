import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "@/modules/users/users.module"

import { Vacancy } from "./entities/vacancy.entity"
import { VacanciesService } from "./vacancies.service"
import { VacanciesController } from "./vacancies.controller"
import { FunnelStep } from "./entities/funnel-step.entity"
import { FunnelStepsService } from "./funnel-steps.service"

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, FunnelStep]), UsersModule],
  controllers: [VacanciesController],
  providers: [VacanciesService, FunnelStepsService],
})
export class VacanciesModule {}
