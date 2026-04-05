import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "@/modules/users/users.module"
import { VacanciesModule } from "@/modules/vacancies/vacancies.module"

import { Application } from "./entities/application.entity"
import { ApplicationMessage } from "./entities/application-message.entity"
import { ApplicationsService } from "./applications.service"
import { ApplicationMessagesService } from "./application-messages.service"
import { CandidateApplicationsService } from "./candidate-applications.service"
import { RecruiterApplicationsService } from "./recruiter-applications.service"
import { CandidateApplicationsController } from "./candidate-applications.controller"
import { RecruiterApplicationsController } from "./recruiter-applications.controller"

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationMessage]),
    UsersModule,
    forwardRef(() => VacanciesModule),
  ],
  controllers: [
    CandidateApplicationsController,
    RecruiterApplicationsController,
  ],
  providers: [
    ApplicationsService,
    CandidateApplicationsService,
    RecruiterApplicationsService,
    ApplicationMessagesService,
  ],
  exports: [CandidateApplicationsService, RecruiterApplicationsService],
})
export class ApplicationsModule {}
