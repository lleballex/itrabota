import { Body, Controller, Post, UseGuards } from "@nestjs/common"

import { LoginDto } from "./dto/login.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { ICurrentUser } from "./interfaces/current-user.interface"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  login(@Body() _body: LoginDto, @CurrentUser() user: ICurrentUser) {
    return user // TODO: generate token and do not return user
  }

  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body) // TODO: generate token and do not return user
  }
}
