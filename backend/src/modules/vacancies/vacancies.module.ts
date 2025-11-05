import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "@/modules/users/users.module"
import { ApplicationsModule } from "@/modules/applications/applications.module"

import { Vacancy } from "./entities/vacancy.entity"
import { VacanciesService } from "./vacancies.service"
import { VacanciesController } from "./vacancies.controller"
import { FunnelStep } from "./entities/funnel-step.entity"
import { FunnelStepsService } from "./funnel-steps.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy, FunnelStep]),
    UsersModule,
    ApplicationsModule,
  ],
  controllers: [VacanciesController],
  providers: [VacanciesService, FunnelStepsService],
  exports: [VacanciesService],
})
export class VacanciesModule {}
