import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

import { UsersModule } from "@/modules/users/users.module"
import { AppConfig } from "@/config/config.interface"

import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { LocalStrategy } from "./strategies/local.strategy"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        secret: configService.get("JWT_SECRET", { infer: true }),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN", { infer: true }),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
