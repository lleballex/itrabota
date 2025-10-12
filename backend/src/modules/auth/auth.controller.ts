import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  Get,
} from "@nestjs/common"
import { Response } from "express"

import { UsersService } from "@/modules/users/users.service"

import { LoginDto } from "./dto/login.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { ICurrentUser } from "./interfaces/current-user.interface"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { Auth } from "./decorators/auth.decorator"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  private setAccessToken(token: string, res: Response) {
    res.cookie("accessToken", token, {
      httpOnly: true, // TODO: secure cookie, change options
    })
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() _body: LoginDto,
    @CurrentUser() user: ICurrentUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(user)
    this.setAccessToken(token, res)
  }

  @Post("register")
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(body)
    this.setAccessToken(token, res)
  }

  @Get("me")
  @Auth()
  getMe(@CurrentUser() user: ICurrentUser) {
    return this.usersService.findOneById(user.id)
  }
}
