import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, In, IsNull, Repository } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { ApplicationMessageType } from "@/modules/applications/entities/application-message.entity"

import { Notification } from "./entities/notification.entity"
import { GetNotificationsDto } from "./dto/get-notifications.dto"

interface CreateNotificationData {
  recipientUserId: string
  type: ApplicationMessageType
  applicationId: string
  applicationMessageId: string
  meetingId?: string | null
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  private createQb(manager?: EntityManager) {
    const repo = manager?.getRepository(Notification) ?? this.notificationsRepo

    return repo
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.recipientUser", "recipientUser")
      .leftJoinAndSelect("notification.application", "application")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.logo", "companyLogo")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("candidate.city", "candidateCity")
      .leftJoinAndSelect("candidate.avatar", "candidateAvatar")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect(
        "notification.applicationMessage",
        "applicationMessage",
      )
      .leftJoinAndSelect("notification.meeting", "meeting")
      .leftJoinAndSelect("meeting.funnelStep", "meetingFunnelStep")
      .orderBy("notification.createdAt", "DESC")
  }

  findAllForCurrentUser(user: ICurrentUser, dto: GetNotificationsDto) {
    const qb = this.createQb().where("recipientUser.id = :userId", {
      userId: user.id,
    })

    if (dto.limit) {
      qb.take(dto.limit)
    }

    return qb.getMany()
  }

  async getUnreadCountForCurrentUser(user: ICurrentUser) {
    const count = await this.notificationsRepo.count({
      where: {
        recipientUser: { id: user.id },
        readAt: IsNull(),
      },
    })

    return { count }
  }

  async markAsRead(user: ICurrentUser, ids: string[]) {
    if (!ids.length) {
      return { ids: [] }
    }

    const notifications = await this.notificationsRepo.find({
      where: {
        id: In(ids),
        recipientUser: { id: user.id },
        readAt: IsNull(),
      },
      select: {
        id: true,
      },
    })

    if (notifications.length) {
      await this.notificationsRepo.update(
        {
          id: In(notifications.map((notification) => notification.id)),
          readAt: IsNull(),
        },
        {
          readAt: new Date(),
        },
      )
    }

    return { ids: notifications.map((notification) => notification.id) }
  }

  async createForApplicationEvent(
    data: CreateNotificationData,
    manager?: EntityManager,
  ) {
    if (data.type === ApplicationMessageType.UserMessage) {
      throw new BadRequestException(
        "Нельзя создать уведомление для пользовательского сообщения",
      )
    }

    const repo = manager?.getRepository(Notification) ?? this.notificationsRepo
    const notification = repo.create({
      recipientUser: { id: data.recipientUserId },
      type: data.type,
      readAt: null,
      application: { id: data.applicationId },
      applicationMessage: { id: data.applicationMessageId },
      meeting: data.meetingId ? { id: data.meetingId } : null,
    })

    return repo.save(notification)
  }
}
