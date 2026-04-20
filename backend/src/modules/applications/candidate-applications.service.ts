import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { DataSource } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { VacanciesService } from "@/modules/vacancies/vacancies.service"
import { UserRole } from "@/modules/users/types/user-role"
import { MeetingsService } from "@/modules/meetings/meetings.service"

import { ApplicationsService } from "./applications.service"
import { GetCandidateApplicationsDto } from "./dto/get-candidate-applications.dto"
import { CreateCandidateApplicationDto } from "./dto/create-candidate-application.dto"
import {
  ApplicationStatus,
  ApplicationType,
} from "./entities/application.entity"
import { ApplicationMessageType } from "./entities/application-message.entity"
import { RejectApplicationDto } from "./dto/reject-application.dto"
import { ApplicationMessagesService } from "./application-messages.service"
import { AcceptCandidateApplicationDto } from "./dto/accept-candidate-application.dto"
import {
  MEETING_DURATION_MINUTES,
  MEETING_TIMEZONE,
} from "@/modules/meetings/constants/meeting.constants"
import { NotificationsService } from "@/modules/notifications/notifications.service"

@Injectable()
export class CandidateApplicationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly applicationsService: ApplicationsService,
    private readonly messagesService: ApplicationMessagesService,
    private readonly meetingsService: MeetingsService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly vacanciesService: VacanciesService,
  ) {}

  async findAll(dto: GetCandidateApplicationsDto, user_: ICurrentUser) {
    const user = await this.usersService.findFilledCandidateById(user_.id)

    const qb = this.applicationsService
      ._createQB(dto)
      .andWhere("candidate.id = :candidateId", {
        candidateId: user.candidate.id,
      })

    return qb.getMany()
  }

  async create(dto: CreateCandidateApplicationDto, user_: ICurrentUser) {
    const applicationId = await this.dataSource.transaction(async (manager) => {
      const vacancy = await this.vacanciesService.findOneById(
        dto.vacancyId,
        manager,
      )

      const user = await this.usersService.findFilledCandidateById(
        user_.id,
        manager,
      )

      return this.applicationsService._create(
        {
          candidate: user.candidate,
          vacancy,
          recipientUserId: vacancy.recruiter!.user!.id,
          type: ApplicationType.Response,
          systemMessageType: ApplicationMessageType.CandidateResponded,
          userMessage: dto.message,
          senderRole: UserRole.Candidate,
        },
        manager,
      )
    })

    return this.applicationsService._findOne({ id: applicationId })
  }

  async findOneByVacancyId(vacancyId: string, user_: ICurrentUser) {
    const vacancy = await this.vacanciesService.findOneById(vacancyId)
    const user = await this.usersService.findFilledCandidateById(user_.id)
    const application = await this.applicationsService._findOne({
      vacancy: { id: vacancy.id },
      candidate: { id: user.candidate.id },
    })

    return application
  }

  async rejectById(id: string, dto: RejectApplicationDto, user_: ICurrentUser) {
    await this.dataSource.transaction(async (manager) => {
      const application = await this.applicationsService._findOne(
        { id },
        manager,
      )

      const user = await this.usersService.findFilledCandidateById(
        user_.id,
        manager,
      )

      if (application.candidate?.id !== user.candidate.id) {
        throw new ForbiddenException(
          "You are not allowed to reject this application",
        )
      }

      await this.applicationsService.reject(
        application,
        { role: user.role, message: dto.message },
        manager,
      )
    })

    return this.applicationsService._findOne({ id })
  }

  async acceptById(
    id: string,
    dto: AcceptCandidateApplicationDto,
    user_: ICurrentUser,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.usersService.findFilledCandidateById(
        user_.id,
        manager,
      )

      const application = await this.applicationsService._findOne(
        { id },
        manager,
      )

      if (application.status !== ApplicationStatus.Pending) {
        throw new ConflictException("Only pending applications can be accepted")
      }

      if (application.candidate?.id !== user.candidate.id) {
        throw new ForbiddenException(
          "You are not allowed to accept this application",
        )
      }

      if (
        !this.applicationsService.isWaitingForCandidateResponse(application)
      ) {
        throw new ConflictException(
          "Application is not waiting for candidate response",
        )
      }

      const shouldCreateMeeting = application.funnelStep?.shouldCreateCall

      if (shouldCreateMeeting) {
        if (!dto.meetingStartsAt) {
          throw new ConflictException(
            "meetingStartsAt is required for this application stage",
          )
        }

        if (
          !application.vacancy?.recruiter?.id ||
          !application.funnelStep?.id
        ) {
          throw new ConflictException("Application stage cannot create meeting")
        }

        const hasMeetingForCurrentStep = application.meetings?.some(
          (meeting) => meeting.funnelStep?.id === application.funnelStep?.id,
        )

        if (hasMeetingForCurrentStep) {
          throw new ConflictException(
            "Meeting has already been scheduled for this application stage",
          )
        }

        await this.meetingsService.assertSlotAvailable(
          application.vacancy.recruiter.id,
          dto.meetingStartsAt,
          manager,
        )
      }

      const candidateAcceptedMessage = await this.messagesService.create(
        {
          application: { id: application.id },
          type: ApplicationMessageType.CandidateAccepted,
          senderRole: UserRole.Candidate,
        },
        manager,
      )

      await this.notificationsService.createForApplicationEvent(
        {
          recipientUserId: application.vacancy!.recruiter!.user!.id,
          type: candidateAcceptedMessage.type,
          applicationId: application.id,
          applicationMessageId: candidateAcceptedMessage.id,
        },
        manager,
      )

      if (shouldCreateMeeting) {
        const meetingStartsAt = new Date(dto.meetingStartsAt!)
        const meetingScheduledMessage = await this.messagesService.create(
          {
            application: { id: application.id },
            type: ApplicationMessageType.MeetingScheduled,
            senderRole: UserRole.Candidate,
          },
          manager,
        )

        const meeting = await this.meetingsService.create(
          {
            application: { id: application.id },
            candidate: { id: application.candidate.id },
            recruiter: { id: application.vacancy!.recruiter!.id },
            funnelStep: { id: application.funnelStep!.id },
            applicationMessage: { id: meetingScheduledMessage.id },
            startsAt: meetingStartsAt,
            endsAt: new Date(
              meetingStartsAt.getTime() + MEETING_DURATION_MINUTES * 60 * 1000,
            ),
            timezone: MEETING_TIMEZONE,
            link: null,
          },
          manager,
        )

        await this.notificationsService.createForApplicationEvent(
          {
            recipientUserId: application.vacancy!.recruiter!.user!.id,
            type: meetingScheduledMessage.type,
            applicationId: application.id,
            applicationMessageId: meetingScheduledMessage.id,
            meetingId: meeting.id,
          },
          manager,
        )
      }
    })

    return this.applicationsService._findOne({ id })
  }
}
