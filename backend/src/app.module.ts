import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppConfig } from "@/config/config.interface"
import { AuthModule } from "@/modules/auth/auth.module"
import { UsersModule } from "@/modules/users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        type: "postgres",
        database: configService.get("DB_NAME", { infer: true }),
        port: configService.get("DB_PORT", { infer: true }),
        host: configService.get("DB_HOST", { infer: true }),
        username: configService.get("DB_USER", { infer: true }),
        password: configService.get("DB_PASSWORD", { infer: true }),
        autoLoadEntities: true,
        synchronize: true, // TODO: remove and setup migrations
      }),
    }),

    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
