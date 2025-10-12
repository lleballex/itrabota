import { createParamDecorator } from "@nestjs/common"
import { Request } from "express"

import { ICurrentUser } from "../interfaces/current-user.interface"

const isCurrentUser = (data: unknown): data is ICurrentUser => {
  return typeof (data as ICurrentUser).id === "string"
}

export const CurrentUser = createParamDecorator((_data, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest()

  if (isCurrentUser(req.user)) {
    return req.user
  }
})
