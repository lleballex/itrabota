import { createParamDecorator } from "@nestjs/common"
import { Request } from "express"

import { ICurrentUser } from "../interfaces/current-user.interface"

const isCurrentUser = (data: unknown): data is ICurrentUser => {
  if (!data) {
    return false
  }

  const user = data as ICurrentUser

  return typeof user.id === "string" && typeof user.role === "string"
}

export const CurrentUser = createParamDecorator((_data, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest()

  if (isCurrentUser(req.user)) {
    return req.user
  }
})
