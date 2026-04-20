import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ApplicationsModule } from "@/modules/applications/applications.module"
import { UsersModule } from "@/modules/users/users.module"

import { CandidateMeetingsController } from "./candidate-meetings.controller"
import { Meeting } from "./entities/meeting.entity"
import { MeetingsService } from "./meetings.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    UsersModule,
    forwardRef(() => ApplicationsModule),
  ],
  controllers: [CandidateMeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
