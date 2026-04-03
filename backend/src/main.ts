import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as cookieParser from "cookie-parser"
import * as express from "express"

import { AppConfig } from "@/config/config.interface"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<AppConfig, true>)

  app.enableCors({
    origin: configService.get("CORS_ORIGINS", { infer: true }).split(","),
    credentials: true,
  })

  app.use(cookieParser())

  app.use(
    express.json({
      limit: configService.get("MAX_REQUEST_BODY_SIZE", { infer: true }),
    }),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder().setTitle("айтиработа.рф").build()

  SwaggerModule.setup("api", app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  )

  await app.listen(configService.get("PORT", { infer: true }))
}

void bootstrap()
