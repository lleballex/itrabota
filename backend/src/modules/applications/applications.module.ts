import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "@/modules/users/users.module"
import { VacanciesModule } from "@/modules/vacancies/vacancies.module"

import { Application } from "./entities/application.entity"
import { ApplicationMessage } from "./entities/application-message.entity"
import { ApplicationsService } from "./applications.service"
import { ApplicationMessagesService } from "./application-messages.service"
import { ApplicationsController } from "./applications.controller"

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationMessage]),
    UsersModule,
    forwardRef(() => VacanciesModule),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationMessagesService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
