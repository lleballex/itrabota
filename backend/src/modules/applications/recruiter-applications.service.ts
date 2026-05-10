import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"

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
import {
  GetRecruiterDashboardDto,
  RecruiterDashboardPeriod,
} from "./dto/get-recruiter-dashboard.dto"
import { ApplicationMessage } from "./entities/application-message.entity"

export type DashboardMetricTrend = "up" | "down" | "flat"

export interface DashboardMetric {
  value: number
  previousValue: number
  delta: number
  deltaPercent: number | null
  trend: DashboardMetricTrend
}

export interface DashboardTimelineBucket {
  bucketStart: string
  responses: number
  accepted: number
  rejected: number
}

export interface DashboardTopVacancy {
  vacancyId: string
  title: string
  responses: number
  accepted: number
  rejected: number
  pending: number
  conversionPercent: number
}

interface DashboardRange {
  period: RecruiterDashboardPeriod
  currentStart: Date
  currentEnd: Date
  previousStart: Date
  previousEnd: Date
}

interface DashboardRawTimestamp {
  createdAt: Date
}

interface DashboardTopVacancyBaseRaw {
  vacancyId: string
  vacancyTitle: string
  applicationType: ApplicationType
  applicationStatus: ApplicationStatus
}

interface DashboardTopVacancyEventRaw {
  vacancyId: string
  vacancyTitle: string
  count: string
}

@Injectable()
export class RecruiterApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,

    @InjectRepository(ApplicationMessage)
    private readonly applicationMessagesRepo: Repository<ApplicationMessage>,

    private readonly dataSource: DataSource,
    private readonly applicationsService: ApplicationsService,
    private readonly messagesService: ApplicationMessagesService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly vacanciesService: VacanciesService,
    private readonly candidatesService: CandidatesService,
  ) {}

  async getDashboard(
    dto: GetRecruiterDashboardDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)
    const range = this.getDashboardRange(dto.period)
    const applicationTypes = dto.includeInvitations
      ? [ApplicationType.Response, ApplicationType.Invitation]
      : [ApplicationType.Response]

    const [
      responses,
      accepted,
      rejected,
      pendingCurrent,
      timeline,
      topVacancies,
    ] = await Promise.all([
      this.getResponseMetrics(user.recruiter.id, range, applicationTypes),
      this.getAcceptedMetrics(user.recruiter.id, range, applicationTypes),
      this.getRejectedMetrics(user.recruiter.id, range, applicationTypes),
      this.getPendingCurrentCount(user.recruiter.id, applicationTypes),
      this.getTimeline(user.recruiter.id, range, applicationTypes),
      this.getTopVacancies(user.recruiter.id, range, applicationTypes),
    ])

    return {
      period: {
        key: range.period,
        currentStart: range.currentStart.toISOString(),
        currentEnd: range.currentEnd.toISOString(),
        previousStart: range.previousStart.toISOString(),
        previousEnd: range.previousEnd.toISOString(),
        includeInvitations: Boolean(dto.includeInvitations),
      },
      summary: {
        responses,
        accepted,
        rejected,
        pendingCurrent: {
          value: pendingCurrent,
        },
      },
      timeline,
      topVacancies,
    }
  }

  async findAll(dto: IRecruiterApplicationsSearchParams, user_: ICurrentUser) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.applicationsService
      ._createQB({ ...dto, searchMode: "recruiter" })
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

  private getDashboardRange(
    period: RecruiterDashboardPeriod = "month",
  ): DashboardRange {
    const now = new Date()
    let currentStart: Date
    let currentEnd: Date

    switch (period) {
      case "day":
        currentStart = this.startOfDay(now)
        currentEnd = this.addDays(currentStart, 1)
        break
      case "week":
        currentStart = this.startOfWeek(now)
        currentEnd = this.addDays(currentStart, 7)
        break
      case "year":
        currentStart = new Date(now.getFullYear(), 0, 1)
        currentEnd = new Date(now.getFullYear() + 1, 0, 1)
        break
      case "month":
      default:
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
        currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        break
    }

    const previousStart = new Date(
      currentStart.getTime() - (currentEnd.getTime() - currentStart.getTime()),
    )

    return {
      period,
      currentStart,
      currentEnd,
      previousStart,
      previousEnd: currentStart,
    }
  }

  private startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  private startOfWeek(date: Date) {
    const start = this.startOfDay(date)
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day

    start.setDate(start.getDate() + diff)

    return start
  }

  private addDays(date: Date, amount: number) {
    const next = new Date(date)

    next.setDate(next.getDate() + amount)

    return next
  }

  private addHours(date: Date, amount: number) {
    const next = new Date(date)

    next.setHours(next.getHours() + amount)

    return next
  }

  private buildMetric(value: number, previousValue: number): DashboardMetric {
    const delta = value - previousValue

    return {
      value,
      previousValue,
      delta,
      deltaPercent:
        previousValue > 0 ? Math.round((delta / previousValue) * 100) : null,
      trend: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
    }
  }

  private createApplicationsDashboardQB(recruiterId: string) {
    return this.applicationsRepo
      .createQueryBuilder("application")
      .leftJoin("application.vacancy", "vacancy")
      .leftJoin("vacancy.recruiter", "recruiter")
      .where("recruiter.id = :recruiterId", { recruiterId })
  }

  private createApplicationMessagesDashboardQB(recruiterId: string) {
    return this.applicationMessagesRepo
      .createQueryBuilder("message")
      .leftJoin("message.application", "application")
      .leftJoin("application.vacancy", "vacancy")
      .leftJoin("vacancy.recruiter", "recruiter")
      .where("recruiter.id = :recruiterId", { recruiterId })
  }

  private async countResponsesInRange(
    recruiterId: string,
    start: Date,
    end: Date,
    applicationTypes: ApplicationType[],
  ) {
    return this.createApplicationsDashboardQB(recruiterId)
      .andWhere("application.type IN (:...applicationTypes)", {
        applicationTypes,
      })
      .andWhere("application.createdAt >= :start", { start })
      .andWhere("application.createdAt < :end", { end })
      .getCount()
  }

  private async countMessagesByTypesInRange(
    recruiterId: string,
    messageTypes: ApplicationMessageType[],
    start: Date,
    end: Date,
    applicationTypes: ApplicationType[],
  ) {
    return this.createApplicationMessagesDashboardQB(recruiterId)
      .andWhere("message.type IN (:...messageTypes)", { messageTypes })
      .andWhere("application.type IN (:...applicationTypes)", {
        applicationTypes,
      })
      .andWhere("message.createdAt >= :start", { start })
      .andWhere("message.createdAt < :end", { end })
      .getCount()
  }

  private async getResponseMetrics(
    recruiterId: string,
    range: DashboardRange,
    applicationTypes: ApplicationType[],
  ) {
    const [value, previousValue] = await Promise.all([
      this.countResponsesInRange(
        recruiterId,
        range.currentStart,
        range.currentEnd,
        applicationTypes,
      ),
      this.countResponsesInRange(
        recruiterId,
        range.previousStart,
        range.previousEnd,
        applicationTypes,
      ),
    ])

    return this.buildMetric(value, previousValue)
  }

  private async getAcceptedMetrics(
    recruiterId: string,
    range: DashboardRange,
    applicationTypes: ApplicationType[],
  ) {
    const [value, previousValue] = await Promise.all([
      this.countMessagesByTypesInRange(
        recruiterId,
        [ApplicationMessageType.RecruiterOfferedJob],
        range.currentStart,
        range.currentEnd,
        applicationTypes,
      ),
      this.countMessagesByTypesInRange(
        recruiterId,
        [ApplicationMessageType.RecruiterOfferedJob],
        range.previousStart,
        range.previousEnd,
        applicationTypes,
      ),
    ])

    return this.buildMetric(value, previousValue)
  }

  private async getRejectedMetrics(
    recruiterId: string,
    range: DashboardRange,
    applicationTypes: ApplicationType[],
  ) {
    const rejectionTypes = [
      ApplicationMessageType.CandidateRejected,
      ApplicationMessageType.RecruiterRejected,
    ]

    const [value, previousValue] = await Promise.all([
      this.countMessagesByTypesInRange(
        recruiterId,
        rejectionTypes,
        range.currentStart,
        range.currentEnd,
        applicationTypes,
      ),
      this.countMessagesByTypesInRange(
        recruiterId,
        rejectionTypes,
        range.previousStart,
        range.previousEnd,
        applicationTypes,
      ),
    ])

    return this.buildMetric(value, previousValue)
  }

  private async getPendingCurrentCount(
    recruiterId: string,
    applicationTypes: ApplicationType[],
  ) {
    return this.createApplicationsDashboardQB(recruiterId)
      .andWhere("application.type IN (:...applicationTypes)", {
        applicationTypes,
      })
      .andWhere("application.status = :status", {
        status: ApplicationStatus.Pending,
      })
      .getCount()
  }

  private createTimelineBuckets(range: DashboardRange) {
    const buckets: Array<{
      start: Date
      end: Date
      value: DashboardTimelineBucket
    }> = []

    let current = new Date(range.currentStart)

    while (current < range.currentEnd) {
      let next: Date

      if (range.period === "day") {
        next = this.addHours(current, 1)
      } else if (range.period === "year") {
        next = new Date(current.getFullYear(), current.getMonth() + 1, 1)
      } else {
        next = this.addDays(current, 1)
      }

      buckets.push({
        start: new Date(current),
        end: next,
        value: {
          bucketStart: current.toISOString(),
          responses: 0,
          accepted: 0,
          rejected: 0,
        },
      })

      current = next
    }

    return buckets
  }

  private incrementTimelineBucket(
    buckets: Array<{
      start: Date
      end: Date
      value: DashboardTimelineBucket
    }>,
    createdAt: Date,
    metric: keyof Pick<
      DashboardTimelineBucket,
      "responses" | "accepted" | "rejected"
    >,
  ) {
    const bucket = buckets.find(
      ({ start, end }) => createdAt >= start && createdAt < end,
    )

    if (bucket) {
      bucket.value[metric] += 1
    }
  }

  private async getTimeline(
    recruiterId: string,
    range: DashboardRange,
    applicationTypes: ApplicationType[],
  ) {
    const [responseRows, acceptedRows, rejectedRows] = await Promise.all([
      this.createApplicationsDashboardQB(recruiterId)
        .select('application."createdAt"', "createdAt")
        .andWhere("application.type IN (:...applicationTypes)", {
          applicationTypes,
        })
        .andWhere('application."createdAt" >= :start', {
          start: range.currentStart,
        })
        .andWhere('application."createdAt" < :end', {
          end: range.currentEnd,
        })
        .getRawMany<DashboardRawTimestamp>(),
      this.createApplicationMessagesDashboardQB(recruiterId)
        .select('message."createdAt"', "createdAt")
        .andWhere("message.type = :type", {
          type: ApplicationMessageType.RecruiterOfferedJob,
        })
        .andWhere("application.type IN (:...applicationTypes)", {
          applicationTypes,
        })
        .andWhere('message."createdAt" >= :start', { start: range.currentStart })
        .andWhere('message."createdAt" < :end', { end: range.currentEnd })
        .getRawMany<DashboardRawTimestamp>(),
      this.createApplicationMessagesDashboardQB(recruiterId)
        .select('message."createdAt"', "createdAt")
        .andWhere("message.type IN (:...types)", {
          types: [
            ApplicationMessageType.CandidateRejected,
            ApplicationMessageType.RecruiterRejected,
          ],
        })
        .andWhere("application.type IN (:...applicationTypes)", {
          applicationTypes,
        })
        .andWhere('message."createdAt" >= :start', { start: range.currentStart })
        .andWhere('message."createdAt" < :end', { end: range.currentEnd })
        .getRawMany<DashboardRawTimestamp>(),
    ])

    const buckets = this.createTimelineBuckets(range)

    for (const row of responseRows) {
      this.incrementTimelineBucket(
        buckets,
        new Date(row.createdAt),
        "responses",
      )
    }

    for (const row of acceptedRows) {
      this.incrementTimelineBucket(
        buckets,
        new Date(row.createdAt),
        "accepted",
      )
    }

    for (const row of rejectedRows) {
      this.incrementTimelineBucket(
        buckets,
        new Date(row.createdAt),
        "rejected",
      )
    }

    return buckets.map((bucket) => bucket.value)
  }

  private async getTopVacancies(
    recruiterId: string,
    range: DashboardRange,
    applicationTypes: ApplicationType[],
  ) {
    const [baseRows, acceptedRows, rejectedRows] = await Promise.all([
      this.createApplicationsDashboardQB(recruiterId)
        .select("vacancy.id", "vacancyId")
        .addSelect("vacancy.title", "vacancyTitle")
        .addSelect("application.type", "applicationType")
        .addSelect("application.status", "applicationStatus")
        .andWhere('application."createdAt" >= :start', {
          start: range.currentStart,
        })
        .andWhere('application."createdAt" < :end', {
          end: range.currentEnd,
        })
        .andWhere("application.type IN (:...applicationTypes)", {
          applicationTypes,
        })
        .getRawMany<DashboardTopVacancyBaseRaw>(),
      this.createApplicationMessagesDashboardQB(recruiterId)
        .select("vacancy.id", "vacancyId")
        .addSelect("vacancy.title", "vacancyTitle")
        .addSelect("COUNT(*)", "count")
        .andWhere("message.type = :type", {
          type: ApplicationMessageType.RecruiterOfferedJob,
        })
        .andWhere("application.type IN (:...applicationTypes)", {
          applicationTypes,
        })
        .andWhere('message."createdAt" >= :start', { start: range.currentStart })
        .andWhere('message."createdAt" < :end', { end: range.currentEnd })
        .groupBy("vacancy.id")
        .addGroupBy("vacancy.title")
        .getRawMany<DashboardTopVacancyEventRaw>(),
      this.createApplicationMessagesDashboardQB(recruiterId)
        .select("vacancy.id", "vacancyId")
        .addSelect("vacancy.title", "vacancyTitle")
        .addSelect("COUNT(*)", "count")
        .andWhere("message.type IN (:...types)", {
          types: [
            ApplicationMessageType.CandidateRejected,
            ApplicationMessageType.RecruiterRejected,
          ],
        })
        .andWhere("application.type IN (:...applicationTypes)", {
          applicationTypes,
        })
        .andWhere('message."createdAt" >= :start', { start: range.currentStart })
        .andWhere('message."createdAt" < :end', { end: range.currentEnd })
        .groupBy("vacancy.id")
        .addGroupBy("vacancy.title")
        .getRawMany<DashboardTopVacancyEventRaw>(),
    ])

    const vacancyMap = new Map<string, DashboardTopVacancy>()

    for (const row of baseRows) {
      const vacancy = vacancyMap.get(row.vacancyId) ?? {
        vacancyId: row.vacancyId,
        title: row.vacancyTitle,
        responses: 0,
        accepted: 0,
        rejected: 0,
        pending: 0,
        conversionPercent: 0,
      }

      vacancy.responses += 1

      if (row.applicationStatus === ApplicationStatus.Pending) {
        vacancy.pending += 1
      }

      vacancyMap.set(row.vacancyId, vacancy)
    }

    for (const row of acceptedRows) {
      const vacancy = vacancyMap.get(row.vacancyId) ?? {
        vacancyId: row.vacancyId,
        title: row.vacancyTitle,
        responses: 0,
        accepted: 0,
        rejected: 0,
        pending: 0,
        conversionPercent: 0,
      }

      vacancy.accepted += Number(row.count)

      vacancyMap.set(row.vacancyId, vacancy)
    }

    for (const row of rejectedRows) {
      const vacancy = vacancyMap.get(row.vacancyId) ?? {
        vacancyId: row.vacancyId,
        title: row.vacancyTitle,
        responses: 0,
        accepted: 0,
        rejected: 0,
        pending: 0,
        conversionPercent: 0,
      }

      vacancy.rejected += Number(row.count)

      vacancyMap.set(row.vacancyId, vacancy)
    }

    return [...vacancyMap.values()]
      .map((vacancy) => ({
        ...vacancy,
        conversionPercent: vacancy.responses
          ? Math.round((vacancy.accepted / vacancy.responses) * 100)
          : 0,
      }))
      .sort((a, b) => {
        const scoreA = a.responses + a.accepted + a.pending
        const scoreB = b.responses + b.accepted + b.pending

        return scoreB - scoreA
      })
      .slice(0, 5)
  }
}
