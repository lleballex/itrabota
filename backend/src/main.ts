import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as cookieParser from "cookie-parser"
import * as express from "express"

import { AppConfig } from "@/config/config.interface"
import { AppModule } from "./app.module"

@Catch()
class UserFacingExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<express.Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const errorResponse = exception.getResponse()
      const body: string | object =
        typeof errorResponse === "string"
          ? { statusCode: status, message: errorResponse }
          : errorResponse

      response.status(status).json(body)
      return
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Что-то пошло не так",
    })
  }
}

const validationMessages: Record<string, string> = {
  isArray: "Значение должно быть списком",
  isBoolean: "Значение должно быть да или нет",
  isDateString: "Введите корректную дату",
  isEmail: "Введите корректную почту",
  isEnum: "Выберите значение из списка",
  isInt: "Введите целое число",
  isNotEmpty: "Поле не заполнено",
  isPositive: "Введите положительное число",
  isString: "Введите текст",
  isUUID: "Некорректный идентификатор",
  nestedValidation: "Некорректные вложенные данные",
}

const flattenValidationErrors = (
  errors: ValidationError[],
  parentPath = "",
): { key: string; message: string }[] => {
  return errors.flatMap((error) => {
    const key = parentPath ? `${parentPath}.${error.property}` : error.property
    const constraint = Object.keys(error.constraints ?? {})[0]
    const fieldError = constraint
      ? [
          {
            key,
            message: validationMessages[constraint] ?? "Некорректное значение",
          },
        ]
      : []

    return [
      ...fieldError,
      ...flattenValidationErrors(error.children ?? [], key),
    ]
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<AppConfig, true>)
  app.setGlobalPrefix("api")
  const expressApp = app
    .getHttpAdapter()
    .getInstance() as unknown as express.Express

  expressApp.set("trust proxy", 1)
  expressApp.set("query parser", "extended")

  app.enableCors({
    origin: configService
      .get("CORS_ORIGINS", { infer: true })
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
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
      exceptionFactory: (errors) =>
        new BadRequestException({
          message: "Проверьте правильность заполнения полей",
          fields: flattenValidationErrors(errors),
        }),
    }),
  )
  app.useGlobalFilters(new UserFacingExceptionFilter())

  const swaggerConfig = new DocumentBuilder().setTitle("айтиработа.рф").build()

  SwaggerModule.setup("api", app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  )

  console.log(configService.get("PORT", { infer: true }))
  console.log("listening")
  await app.listen(configService.get("PORT", { infer: true }))
}

void bootstrap()
