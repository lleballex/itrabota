import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ApplicationsModule } from "@/modules/applications/applications.module"
import { UsersModule } from "@/modules/users/users.module"

import { CandidateMeetingsController } from "./candidate-meetings.controller"
import { Meeting } from "./entities/meeting.entity"
import { MeetingsService } from "./meetings.service"
import { RecruiterMeetingsController } from "./recruiter-meetings.controller"
import { ZoomMeetingsService } from "./zoom-meetings.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    UsersModule,
    forwardRef(() => ApplicationsModule),
  ],
  controllers: [CandidateMeetingsController, RecruiterMeetingsController],
  providers: [MeetingsService, ZoomMeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
