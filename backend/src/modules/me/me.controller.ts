import { Body, Controller, Get, Patch, Post } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { UserRole } from "@/modules/users/entities/user.entity"

import { MeRecruiterService } from "./me-recruiter.service"
import { CreateMeRecruiterDto } from "./dto/create-me-recruiter.dto"
import { UpdateMeRecruiterDto } from "./dto/update-me-recruiter.dto"

@Controller("me")
export class MeController {
  constructor(
    private readonly meRecruiterService: MeRecruiterService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Auth()
  getMe(@CurrentUser() user: ICurrentUser) {
    return this.usersService.findOneById(user.id)
  }

  @Post("/recruiter")
  @Auth(UserRole.Recruiter)
  createRecruiter(
    @Body() body: CreateMeRecruiterDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meRecruiterService.create(body, user)
  }

  @Patch("/recruiter")
  @Auth(UserRole.Recruiter)
  updateRecruiter(
    @Body() body: UpdateMeRecruiterDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.meRecruiterService.update(body, user)
  }
}
