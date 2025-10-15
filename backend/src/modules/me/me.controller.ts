import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { RecruitersGuard } from "@/modules/auth/guards/recruiters.guard"

import { MeService } from "./me.service"
import { CreateRecruiterDto } from "./dto/create-recruiter.dto"

@Controller("me")
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Auth()
  getMe(@CurrentUser() user: ICurrentUser) {
    return this.usersService.findOneById(user.id)
  }

  @Post("/recruiter")
  @Auth() // TODO: add roles to auth, so there will be no need to apply useguards
  @UseGuards(RecruitersGuard)
  createRecruiter(
    @Body() body: CreateRecruiterDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meService.createRecruiter(body, user)
  }
}
