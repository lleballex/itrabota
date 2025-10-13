import { Controller, Get } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"

import { MeService } from "./me.service"

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
}
