import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "@/modules/users/users.module"
import { VacanciesModule } from "@/modules/vacancies/vacancies.module"
import { MeetingsModule } from "@/modules/meetings/meetings.module"
import { NotificationsModule } from "@/modules/notifications/notifications.module"

import { Application } from "./entities/application.entity"
import { ApplicationMessage } from "./entities/application-message.entity"
import { ApplicationStageResult } from "./entities/application-stage-result.entity"
import { ApplicationsService } from "./applications.service"
import { ApplicationMessagesService } from "./application-messages.service"
import { CandidateApplicationsService } from "./candidate-applications.service"
import { RecruiterApplicationsService } from "./recruiter-applications.service"
import { CandidateApplicationsController } from "./candidate-applications.controller"
import { RecruiterApplicationsController } from "./recruiter-applications.controller"
import { ApplicationStageResultsService } from "./application-stage-results.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      ApplicationMessage,
      ApplicationStageResult,
    ]),
    UsersModule,
    forwardRef(() => VacanciesModule),
    forwardRef(() => MeetingsModule),
    NotificationsModule,
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
    ApplicationStageResultsService,
  ],
  exports: [
    ApplicationsService,
    CandidateApplicationsService,
    RecruiterApplicationsService,
    ApplicationStageResultsService,
  ],
})
export class ApplicationsModule {}
