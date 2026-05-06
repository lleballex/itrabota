import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { DataSource } from "typeorm"

import { UsersService } from "@/modules/users/users.service"
import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { VacanciesService } from "@/modules/vacancies/vacancies.service"
import { VacancyStatus } from "@/modules/vacancies/entities/vacancy.entity"
import { CandidatesService } from "@/modules/users/candidates.service"
import { UserRole } from "@/modules/users/types/user-role"

import { ApplicationsService } from "./applications.service"
import { CreateRecruiterApplicationDto } from "./dto/create-recruiter-application.dto"
import {
  Application,
  ApplicationStatus,
  ApplicationType,
} from "./entities/application.entity"
import { ApplicationMessageType } from "./entities/application-message.entity"
import { RejectApplicationDto } from "./dto/reject-application.dto"
import { IRecruiterApplicationsSearchParams } from "./interfaces/recruiter-applications-service.interface"
import { OfferRecruiterApplicationDto } from "./dto/offer-recruiter-application"
import { ApplicationMessagesService } from "./application-messages.service"
import { NotificationsService } from "@/modules/notifications/notifications.service"

@Injectable()
export class RecruiterApplicationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly applicationsService: ApplicationsService,
    private readonly messagesService: ApplicationMessagesService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly vacanciesService: VacanciesService,
    private readonly candidatesService: CandidatesService,
  ) {}

  async findAll(dto: IRecruiterApplicationsSearchParams, user_: ICurrentUser) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.applicationsService
      ._createQB(dto)
      .andWhere("recruiter.id = :recruiterId", {
        recruiterId: user.recruiter.id,
      })

    if (dto.candidateId) {
      qb.andWhere("candidate.id = :candidateId", {
        candidateId: dto.candidateId,
      })
        .leftJoinAndSelect("application.funnelStep", "funnelStep")
        .leftJoinAndSelect("application.messages", "message")
        .leftJoinAndSelect("message.meeting", "messageMeeting")
        .addOrderBy("message.createdAt", "ASC")
        .addOrderBy(
          `CASE
            WHEN message.type = '${ApplicationMessageType.CandidateAccepted}' THEN 0
            WHEN message.type = '${ApplicationMessageType.MeetingScheduled}' THEN 1
            WHEN message.type = '${ApplicationMessageType.UserMessage}' THEN 3
            ELSE 2
          END`,
          "ASC",
        )
        .addOrderBy("message.id", "ASC")
    }

    return qb.getMany()
  }

  async create(dto: CreateRecruiterApplicationDto, user_: ICurrentUser) {
    const applicationId = await this.dataSource.transaction(async (manager) => {
      const vacancy = await this.vacanciesService.findOneById(
        dto.vacancyId,
        manager,
      )

      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      if (vacancy.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException("Вы не являетесь автором этой вакансии")
      }

      if (vacancy.status !== VacancyStatus.Active) {
        throw new ConflictException(
          "Нельзя пригласить кандидата на неактивную вакансию",
        )
      }

      const candidate = await this.candidatesService.findOneForRecruiterById(
        dto.candidateId,
        user,
      )

      return this.applicationsService._create(
        {
          candidate,
          vacancy,
          recipientUserId: candidate.user!.id,
          type: ApplicationType.Invitation,
          systemMessageType: ApplicationMessageType.RecruiterInvited,
          userMessage: dto.message,
          senderRole: UserRole.Recruiter,
          funnelStepId: vacancy.funnelSteps?.[0]?.id ?? null,
        },
        manager,
      )
    })

    return this.applicationsService._findOne({ id: applicationId })
  }

  async findOneById(id: string, user_: ICurrentUser) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    return this.applicationsService._findOne({
      id,
      vacancy: { recruiter: { id: user.recruiter.id } },
    })
  }

  async rejectById(id: string, dto: RejectApplicationDto, user_: ICurrentUser) {
    await this.dataSource.transaction(async (manager) => {
      const application = await this.applicationsService._findOne(
        { id },
        manager,
      )

      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      if (application.vacancy?.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException(
          "Вы не можете отклонить этот процесс найма",
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

  async offerById(
    id: string,
    dto: OfferRecruiterApplicationDto,
    user_: ICurrentUser,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const applicationsRepo = manager.getRepository(Application)

      const user = await this.usersService.findFilledRecruiterById(
        user_.id,
        manager,
      )

      const application = await this.applicationsService._findOne(
        { id },
        manager,
      )

      if (application.status !== ApplicationStatus.Pending) {
        throw new ConflictException(
          "На следующий этап можно перевести только активный процесс найма",
        )
      }

      if (application.vacancy?.recruiter?.id !== user.recruiter.id) {
        throw new ForbiddenException(
          "Вы не можете перевести этот процесс найма на следующий этап",
        )
      }

      if (this.applicationsService.isWaitingForCandidateResponse(application)) {
        throw new ConflictException(
          "Нельзя перейти дальше, пока кандидат не ответит на приглашение",
        )
      }

      const nextFunnelStep =
        this.applicationsService.getNextFunnelStep(application)

      if (nextFunnelStep) {
        application.funnelStep = nextFunnelStep
        await applicationsRepo.save(application)

        const offeredStepMessage = await this.messagesService.create(
          {
            application: { id: application.id },
            type: ApplicationMessageType.RecruiterOfferedStep,
            senderRole: UserRole.Recruiter,
          },
          manager,
        )

        await this.notificationsService.createForApplicationEvent(
          {
            recipientUserId: application.candidate!.user!.id,
            type: offeredStepMessage.type,
            applicationId: application.id,
            applicationMessageId: offeredStepMessage.id,
          },
          manager,
        )
      } else {
        application.status = ApplicationStatus.Approved
        await applicationsRepo.save(application)

        const offeredJobMessage = await this.messagesService.create(
          {
            application: { id: application.id },
            type: ApplicationMessageType.RecruiterOfferedJob,
            senderRole: UserRole.Recruiter,
          },
          manager,
        )

        await this.notificationsService.createForApplicationEvent(
          {
            recipientUserId: application.candidate!.user!.id,
            type: offeredJobMessage.type,
            applicationId: application.id,
            applicationMessageId: offeredJobMessage.id,
          },
          manager,
        )
      }

      await this.messagesService.create(
        {
          application: { id: application.id },
          type: ApplicationMessageType.UserMessage,
          senderRole: UserRole.Recruiter,
          content: dto.message,
        },
        manager,
      )
    })
  }
}
