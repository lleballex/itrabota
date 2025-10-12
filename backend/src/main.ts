import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix("api")

  app.enableCors({
    origin: "http://localhost:3000", // TODO: from env
    credentials: true,
  })

  app.use(cookieParser())

  const swaggerConfig = new DocumentBuilder().setTitle("айтиработа.рф").build()

  SwaggerModule.setup("api", app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  )

  await app.listen(process.env.PORT ?? 8000)
}

bootstrap()
