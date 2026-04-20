import { Controller, Get, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UserRole } from "@/modules/users/types/user-role"

import { GetMeetingsRangeDto } from "./dto/get-meetings-range.dto"
import { MeetingsService } from "./meetings.service"

@Controller("meetings/recruiter")
@Auth(UserRole.Recruiter)
export class RecruiterMeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  getMeetings(
    @Query() query: GetMeetingsRangeDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meetingsService.getRecruiterMeetings(user, query.from, query.to)
  }
}
