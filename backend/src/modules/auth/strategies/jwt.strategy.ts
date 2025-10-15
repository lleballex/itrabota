import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt"
import { Request } from "express"

import { AppConfig } from "@/config/config.interface"

import { ICurrentUser } from "../interfaces/current-user.interface"
import { IJwtPayload } from "../interfaces/jwt-payload.interface"

const jwtExtractorFromCookie: JwtFromRequestFunction<Request> = (req) => {
  return (req.cookies.accessToken as string | undefined) ?? null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService<AppConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookie]),
      secretOrKey: configService.get("JWT_SECRET", { infer: true }),
    })
  }

  validate(payload: IJwtPayload): ICurrentUser {
    return { id: payload.sub, role: payload.role }
  }
}
