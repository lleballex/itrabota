import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import * as cookieParser from "cookie-parser"
import * as express from "express"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix("api")

  app.enableCors({
    origin: "http://localhost:3000", // TODO: from env
    credentials: true,
  })

  app.use(cookieParser())

  app.use(express.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }))

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

  await app.listen(process.env.PORT ?? 8000)
}

bootstrap()
