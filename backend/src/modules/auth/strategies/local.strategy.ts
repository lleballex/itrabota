import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { Strategy } from "passport-local"

import { AuthService } from "../auth.service"
import { ICurrentUser } from "../interfaces/current-user.interface"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    })
  }

  async validate(email: string, password: string): Promise<ICurrentUser> {
    const user = await this.authService.validateUser({ email, password })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
