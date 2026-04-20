import { Body, Controller, Get, Post, Query } from "@nestjs/common"

import { Auth } from "@/modules/auth/decorators/auth.decorator"
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"

import { GetNotificationsDto } from "./dto/get-notifications.dto"
import { ReadNotificationsDto } from "./dto/read-notifications.dto"
import { NotificationsService } from "./notifications.service"

@Controller("notifications")
@Auth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @Query() query: GetNotificationsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.notificationsService.findAllForCurrentUser(user, query)
  }

  @Get("unread-count")
  getUnreadCount(@CurrentUser() user: ICurrentUser) {
    return this.notificationsService.getUnreadCountForCurrentUser(user)
  }

  @Post("read")
  markAsRead(
    @Body() body: ReadNotificationsDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.notificationsService.markAsRead(user, body.ids)
  }
}
