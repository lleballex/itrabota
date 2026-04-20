import { Controller, Get, Param, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { GetMeetingsRangeDto } from "./dto/get-meetings-range.dto"
import { GetMeetingSlotsDto } from "./dto/get-meeting-slots.dto"
import { MeetingsService } from "./meetings.service"

@Controller("meetings/candidate")
@Auth(UserRole.Candidate)
export class CandidateMeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  getMeetings(
    @Query() query: GetMeetingsRangeDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meetingsService.getCandidateMeetings(user, query.from, query.to)
  }

  @Get("application/:applicationId/slots")
  getSlots(
    @Param("applicationId") applicationId: string,
    @Query() query: GetMeetingSlotsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meetingsService.getCandidateSlots(
      applicationId,
      query.date,
      user,
    )
  }
}
