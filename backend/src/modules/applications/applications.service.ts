import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, EntityManager, FindOptionsWhere, Repository } from "typeorm"

import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { UserRole } from "@/modules/users/types/user-role"
import { NotificationsService } from "@/modules/notifications/notifications.service"
import {
  createCaseInsensitiveSearchExpression,
  normalizeSearchQuery,
} from "@/common/lib/search"
import { calculateTotalWorkExperienceMonths } from "@/modules/users/lib/calculate-total-work-experience-months"

import { Application, ApplicationStatus } from "./entities/application.entity"
import { ApplicationMessagesService } from "./application-messages.service"
import { ApplicationMessageType } from "./entities/application-message.entity"
import {
  IApplicationCreateData,
  IApplicationsSearchParams,
} from "./interfaces/application-service.interface"

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,

    private readonly messagesService: ApplicationMessagesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  _createQB(params?: IApplicationsSearchParams, manager?: EntityManager) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const qb = repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.user", "recruiterUser")
      .leftJoinAndSelect("vacancy.specialization", "specialization")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("company.logo", "companyLogo")
      .leftJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("candidate.user", "candidateUser")
      .leftJoinAndSelect("candidate.city", "candidateCity")
      .leftJoinAndSelect("candidate.specialization", "candidateSpecialization")
      .leftJoinAndSelect("candidate.skills", "candidateSkill")
      .leftJoinAndSelect("candidate.workExperience", "candidateWorkExperience")
      .leftJoinAndSelect("candidate.avatar", "candidateAvatar")
      .leftJoinAndSelect("application.meetings", "meeting")
      .leftJoinAndSelect("meeting.funnelStep", "meetingFunnelStep")
      .orderBy("application.createdAt", "DESC")

    if (params?.vacancyId) {
      qb.andWhere("vacancy.id = :vacancyId", {
        vacancyId: params.vacancyId,
      })
    }

    const query = normalizeSearchQuery(params?.query)

    if (query) {
      const vacancyTitleSearch =
        createCaseInsensitiveSearchExpression("vacancy.title")
      const candidateFullNameSearch = createCaseInsensitiveSearchExpression(
        "concat_ws(' ', candidate.lastName, candidate.firstName, candidate.patronymic)",
      )

      qb.andWhere(
        new Brackets((qb) => {
          qb.where(`${vacancyTitleSearch} LIKE :query`).orWhere(
            `${candidateFullNameSearch} LIKE :query`,
          )
        }),
        { query: `%${query}%` },
      )
    }

    if (params?.type) {
      qb.andWhere("application.type = :type", { type: params?.type })
    }

    if (params?.status) {
      qb.andWhere("application.status = :status", { status: params?.status })
    }

    return qb
  }

  async _findOne(
    where: FindOptionsWhere<Application>,
    manager?: EntityManager,
  ) {
    const application = await this._createQB(undefined, manager)
      .setFindOptions({ where })
      .leftJoinAndSelect("application.messages", "message")
      .leftJoinAndSelect("message.meeting", "messageMeeting")
      .leftJoinAndSelect("application.meetings", "applicationMeeting")
      .leftJoinAndSelect(
        "applicationMeeting.funnelStep",
        "applicationMeetingFunnelStep",
      )
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect("vacancy.funnelSteps", "vacancyFunnelStep")
      .addOrderBy("vacancyFunnelStep.index", "ASC")
      .addOrderBy("applicationMeeting.startsAt", "ASC")
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
      .getOne()

    if (!application) {
      throw new NotFoundException("Процесс найма не найден")
    }

    if (application.candidate) {
      application.candidate.totalWorkExperienceMonths =
        calculateTotalWorkExperienceMonths(application.candidate.workExperience)
    }

    return application
  }

  async _create(data: IApplicationCreateData, manager: EntityManager) {
    const applicationsRepo = manager.getRepository(Application)

    await this.validateBeforeCreating(data.vacancy, data.candidate, manager)

    const application = await applicationsRepo.save(
      applicationsRepo.create({
        type: data.type,
        vacancy: { id: data.vacancy.id },
        candidate: { id: data.candidate.id },
        funnelStep: data.funnelStepId ? { id: data.funnelStepId } : null,
      }),
    )

    const systemMessage = await this.messagesService.create(
      {
        application: { id: application.id },
        type: data.systemMessageType,
        senderRole: data.senderRole,
      },
      manager,
    )

    await this.notificationsService.createForApplicationEvent(
      {
        recipientUserId: data.recipientUserId,
        type: data.systemMessageType,
        applicationId: application.id,
        applicationMessageId: systemMessage.id,
      },
      manager,
    )

    if (data.userMessage) {
      await this.messagesService.create(
        {
          application: { id: application.id },
          type: ApplicationMessageType.UserMessage,
          senderRole: data.senderRole,
          content: data.userMessage,
        },
        manager,
      )
    }

    return application.id
  }

  private async validateBeforeCreating(
    vacancy: Vacancy,
    candidate: Candidate,
    manager?: EntityManager,
  ) {
    try {
      await this._findOne(
        {
          vacancy: { id: vacancy.id },
          candidate: { id: candidate.id },
        },
        manager,
      )
    } catch (e) {
      if (e instanceof NotFoundException) {
        return
      }
      throw e
    }

    throw new ConflictException("Процесс найма уже существует")
  }

  async reject(
    application: Application,
    data: {
      role: UserRole
      message: string
    },
    manager?: EntityManager,
  ) {
    const applicationsRepo =
      manager?.getRepository(Application) ?? this.applicationsRepo

    if (application.status !== ApplicationStatus.Pending) {
      throw new ConflictException(
        "Отклонить можно только активный процесс найма",
      )
    }

    application.status = ApplicationStatus.Rejected

    await applicationsRepo.save(application)

    const systemMessage = await this.messagesService.create(
      {
        application: { id: application.id },
        type:
          data.role === UserRole.Candidate
            ? ApplicationMessageType.CandidateRejected
            : ApplicationMessageType.RecruiterRejected,
        senderRole: data.role,
      },
      manager,
    )

    await this.notificationsService.createForApplicationEvent(
      {
        recipientUserId:
          data.role === UserRole.Candidate
            ? application.vacancy!.recruiter!.user!.id
            : application.candidate!.user!.id,
        type: systemMessage.type,
        applicationId: application.id,
        applicationMessageId: systemMessage.id,
      },
      manager,
    )

    await this.messagesService.create(
      {
        application: { id: application.id },
        type: ApplicationMessageType.UserMessage,
        senderRole: data.role,
        content: data.message,
      },
      manager,
    )
  }

  async rejectPendingForArchivedVacancy(
    vacancy: Vacancy,
    manager: EntityManager,
  ) {
    const applicationsRepo = manager.getRepository(Application)
    const applications = await this._createQB(
      { vacancyId: vacancy.id },
      manager,
    )
      .andWhere("application.status = :status", {
        status: ApplicationStatus.Pending,
      })
      .getMany()

    for (const application of applications) {
      application.status = ApplicationStatus.Rejected

      await applicationsRepo.save(application)

      const systemMessage = await this.messagesService.create(
        {
          application: { id: application.id },
          type: ApplicationMessageType.VacancyArchived,
          senderRole: UserRole.Recruiter,
        },
        manager,
      )

      await this.notificationsService.createForApplicationEvent(
        {
          recipientUserId: application.candidate!.user!.id,
          type: systemMessage.type,
          applicationId: application.id,
          applicationMessageId: systemMessage.id,
        },
        manager,
      )
    }
  }

  getNextFunnelStep(application: Application) {
    const funnelSteps = application.vacancy?.funnelSteps ?? []

    if (!funnelSteps.length) {
      return null
    }

    const currentStepIdx = funnelSteps.findIndex(
      (step) => step.id === application.funnelStep?.id,
    )

    return funnelSteps[currentStepIdx + 1] ?? null
  }

  isWaitingForCandidateResponse(application: Application) {
    if (
      !application.messages?.length ||
      application.status !== ApplicationStatus.Pending
    ) {
      return false
    }

    const lastMessage =
      application.messages[application.messages.length - 1].type ===
      ApplicationMessageType.UserMessage
        ? application.messages[application.messages.length - 2]
        : application.messages[application.messages.length - 1]

    return (
      lastMessage.type === ApplicationMessageType.RecruiterInvited ||
      lastMessage.type === ApplicationMessageType.RecruiterOfferedStep ||
      lastMessage.type === ApplicationMessageType.RecruiterOfferedJob
    )
  }
}
