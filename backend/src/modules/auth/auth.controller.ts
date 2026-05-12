import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { CookieOptions, Response } from "express"

import { AppConfig } from "@/config/config.interface"

import { LoginDto } from "./dto/login.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { Auth } from "./decorators/auth.decorator"
import { ICurrentUser } from "./interfaces/current-user.interface"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  private getAccessTokenCookieOptions(): CookieOptions {
    const sameSiteValue =
      this.configService
        .get("COOKIE_SAME_SITE", { infer: true })
        ?.toLowerCase() ?? "strict"

    const sameSite: CookieOptions["sameSite"] =
      sameSiteValue === "lax" || sameSiteValue === "none"
        ? sameSiteValue
        : "strict"

    const domain = this.configService
      .get("COOKIE_DOMAIN", { infer: true })
      ?.trim()

    return {
      httpOnly: true,
      secure:
        this.configService.get("COOKIE_SECURE", { infer: true }) === "true",
      sameSite,
      path: "/",
      ...(domain ? { domain } : {}),
    }
  }

  private setAccessToken(token: string, res: Response) {
    res.cookie("accessToken", token, this.getAccessTokenCookieOptions())
  }

  private removeAccessToken(res: Response) {
    res.clearCookie("accessToken", this.getAccessTokenCookieOptions())
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
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

  @Post("logout")
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    this.removeAccessToken(res)
  }
}
