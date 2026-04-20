import { Controller, Get, Param, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { GetMeetingSlotsDto } from "./dto/get-meeting-slots.dto"
import { MeetingsService } from "./meetings.service"

@Controller("meetings/candidate")
@Auth(UserRole.Candidate)
export class CandidateMeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get("application/:applicationId/slots")
  getSlots(
    @Param("applicationId") applicationId: string,
    @Query() query: GetMeetingSlotsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meetingsService.getCandidateSlots(applicationId, query.date, user)
  }
}
