import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"

import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { VacancyStatus } from "@/modules/vacancies/entities/vacancy.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { UserRole } from "@/modules/users/types/user-role"
import { NotificationsService } from "@/modules/notifications/notifications.service"
import { applyTokenizedCaseInsensitiveSearch } from "@/common/lib/search"
import { calculateTotalWorkExperienceMonths } from "@/modules/users/lib/calculate-total-work-experience-months"

import { Application, ApplicationStatus } from "./entities/application.entity"
import { ApplicationMessagesService } from "./application-messages.service"
import { ApplicationMessageType } from "./entities/application-message.entity"
import {
  IApplicationCreateData,
  IApplicationsSearchParams,
} from "./interfaces/application-service.interface"
import { IRecruiterApplicationsSearchParams } from "./interfaces/recruiter-applications-service.interface"

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
      .leftJoinAndSelect("candidate.projects", "candidateProjectItem")
      .leftJoinAndSelect("candidateProjectItem.skills", "candidateProjectSkill")
      .leftJoinAndSelect("candidate.avatar", "candidateAvatar")
      .leftJoinAndSelect("application.meetings", "meeting")
      .leftJoinAndSelect("meeting.funnelStep", "meetingFunnelStep")
      .orderBy("application.createdAt", "DESC")

    if (params?.vacancyId) {
      qb.andWhere("vacancy.id = :vacancyId", {
        vacancyId: params.vacancyId,
      })
    }

    const searchExpressions = ["vacancy.title"]

    if (params?.searchMode === "candidate") {
      searchExpressions.push("company.name")
    } else if (params?.searchMode === "recruiter") {
      searchExpressions.push(
        "candidate.firstName",
        "candidate.lastName",
        "candidate.patronymic",
        "concat_ws(' ', candidate.lastName, candidate.firstName, candidate.patronymic)",
        "concat_ws(' ', candidate.firstName, candidate.lastName, candidate.patronymic)",
      )
    }

    applyTokenizedCaseInsensitiveSearch(
      qb,
      params?.query,
      searchExpressions,
      "applicationSearch",
    )

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

  async _findOneForCandidateVacancy(
    vacancyId: string,
    candidateId: string,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .innerJoin("application.vacancy", "vacancy")
      .innerJoin("application.candidate", "candidate")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect("application.messages", "message")
      .leftJoinAndSelect("message.meeting", "messageMeeting")
      .leftJoinAndSelect("application.meetings", "applicationMeeting")
      .leftJoinAndSelect(
        "applicationMeeting.funnelStep",
        "applicationMeetingFunnelStep",
      )
      .where("vacancy.id = :vacancyId", { vacancyId })
      .andWhere("vacancy.status = :vacancyStatus", {
        vacancyStatus: VacancyStatus.Active,
      })
      .andWhere("candidate.id = :candidateId", { candidateId })
      .orderBy("application.createdAt", "DESC")
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

    return application
  }

  async _findMeetingSlotsContextById(
    applicationId: string,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .innerJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .innerJoinAndSelect("application.vacancy", "vacancy")
      .innerJoinAndSelect("vacancy.recruiter", "recruiter")
      .where("application.id = :applicationId", { applicationId })
      .getOne()

    if (!application) {
      throw new NotFoundException("Процесс найма не найден")
    }

    return application
  }

  async _findRecruiterAccessContextById(
    applicationId: string,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .innerJoinAndSelect("application.vacancy", "vacancy")
      .innerJoinAndSelect("vacancy.recruiter", "recruiter")
      .where("application.id = :applicationId", { applicationId })
      .getOne()

    if (!application) {
      throw new NotFoundException("Процесс найма не найден")
    }

    return application
  }

  async _findStageResultEditContextById(
    applicationId: string,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .innerJoinAndSelect("application.vacancy", "vacancy")
      .innerJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect("application.messages", "message")
      .where("application.id = :applicationId", { applicationId })
      .orderBy("message.createdAt", "ASC")
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

    return application
  }

  async _findRejectContextById(applicationId: string, manager?: EntityManager) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("candidate.user", "candidateUser")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.user", "recruiterUser")
      .where("application.id = :applicationId", { applicationId })
      .getOne()

    if (!application) {
      throw new NotFoundException("Процесс найма не найден")
    }

    return application
  }

  async _findRecruiterOfferContextById(
    applicationId: string,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("candidate.user", "candidateUser")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("vacancy.funnelSteps", "vacancyFunnelStep")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect("application.messages", "message")
      .where("application.id = :applicationId", { applicationId })
      .orderBy("vacancyFunnelStep.index", "ASC")
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

    return application
  }

  async _findAllForCandidateList(
    params: IApplicationsSearchParams & { candidateId: string },
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo
    const qb = repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("company.logo", "companyLogo")
      .leftJoinAndSelect("vacancy.specialization", "specialization")
      .leftJoinAndSelect("vacancy.city", "city")
      .where('application."candidateId" = :candidateId', {
        candidateId: params.candidateId,
      })
      .andWhere("vacancy.status = :vacancyStatus", {
        vacancyStatus: VacancyStatus.Active,
      })
      .orderBy("application.createdAt", "DESC")

    applyTokenizedCaseInsensitiveSearch(
      qb,
      params.query,
      ["vacancy.title", "company.name"],
      "applicationSearch",
    )

    if (params.type) {
      qb.andWhere("application.type = :type", { type: params.type })
    }

    if (params.status) {
      qb.andWhere("application.status = :status", { status: params.status })
    }

    return qb.getMany()
  }

  async _findAllForRecruiterList(
    params: IRecruiterApplicationsSearchParams & { recruiterId: string },
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    if (params.candidateId) {
      const qb = repo
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.vacancy", "vacancy")
        .leftJoinAndSelect("vacancy.recruiter", "recruiter")
        .leftJoinAndSelect("recruiter.company", "company")
        .leftJoinAndSelect("application.messages", "message")
        .where('vacancy."recruiterId" = :recruiterId', {
          recruiterId: params.recruiterId,
        })
        .andWhere('application."candidateId" = :candidateId', {
          candidateId: params.candidateId,
        })
        .orderBy("application.createdAt", "DESC")
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

      if (params.type) {
        qb.andWhere("application.type = :type", { type: params.type })
      }

      if (params.status) {
        qb.andWhere("application.status = :status", { status: params.status })
      }

      return qb.getMany()
    }

    const qb = repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("candidate.city", "candidateCity")
      .leftJoinAndSelect("candidate.specialization", "candidateSpecialization")
      .leftJoinAndSelect("candidate.skills", "candidateSkill")
      .leftJoinAndSelect("candidate.workExperience", "candidateWorkExperience")
      .leftJoinAndSelect("candidate.projects", "candidateProjectItem")
      .leftJoinAndSelect("candidate.avatar", "candidateAvatar")
      .where('vacancy."recruiterId" = :recruiterId', {
        recruiterId: params.recruiterId,
      })
      .orderBy("application.createdAt", "DESC")

    applyTokenizedCaseInsensitiveSearch(
      qb,
      params.query,
      [
        "candidate.firstName",
        "candidate.lastName",
        "candidate.patronymic",
        "concat_ws(' ', candidate.lastName, candidate.firstName, candidate.patronymic)",
        "concat_ws(' ', candidate.firstName, candidate.lastName, candidate.patronymic)",
      ],
      "applicationSearch",
    )

    if (params.vacancyId) {
      qb.andWhere('application."vacancyId" = :vacancyId', {
        vacancyId: params.vacancyId,
      })
    }

    if (params.type) {
      qb.andWhere("application.type = :type", { type: params.type })
    }

    if (params.status) {
      qb.andWhere("application.status = :status", { status: params.status })
    }

    const applications = await qb.getMany()

    for (const application of applications) {
      if (application.candidate) {
        application.candidate.totalWorkExperienceMonths =
          calculateTotalWorkExperienceMonths(
            application.candidate.workExperience,
          )
      }
    }

    return applications
  }

  async _findRecruiterViewContext(
    applicationId: string,
    recruiterId: string,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const application = await repo
      .createQueryBuilder("application")
      .innerJoinAndSelect("application.candidate", "candidate")
      .innerJoinAndSelect("application.vacancy", "vacancy")
      .innerJoin("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect("application.messages", "message")
      .leftJoinAndSelect("message.meeting", "messageMeeting")
      .leftJoinAndSelect("application.meetings", "meeting")
      .leftJoinAndSelect("meeting.funnelStep", "meetingFunnelStep")
      .where("application.id = :applicationId", { applicationId })
      .andWhere("recruiter.id = :recruiterId", { recruiterId })
      .orderBy("meeting.startsAt", "ASC")
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
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo
    const existingCount = await repo.count({
      where: {
        vacancy: { id: vacancy.id },
        candidate: { id: candidate.id },
      },
    })

    if (existingCount > 0) {
      throw new ConflictException("Процесс найма уже существует")
    }
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

  async hasForVacancy(vacancyId: string, manager?: EntityManager) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const count = await repo.count({
      where: {
        vacancy: { id: vacancyId },
      },
    })

    return count > 0
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
