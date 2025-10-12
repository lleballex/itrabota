import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  const swaggerConfig = new DocumentBuilder().setTitle("айтиработа.рф").build()

  SwaggerModule.setup("api", app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  )

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
