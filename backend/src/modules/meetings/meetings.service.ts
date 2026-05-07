import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, EntityManager, Repository } from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { ApplicationsService } from "@/modules/applications/applications.service"
import { UsersService } from "@/modules/users/users.service"

import {
  MEETING_DURATION_MINUTES,
  MEETING_WORKDAY_END_HOUR,
  MEETING_WORKDAY_START_HOUR,
  MOSCOW_UTC_OFFSET_HOURS,
} from "./constants/meeting.constants"
import { Meeting } from "./entities/meeting.entity"
import { ZoomMeetingsService } from "./zoom-meetings.service"

export interface MeetingSlot {
  startsAt: string
  endsAt: string
}

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingsRepo: Repository<Meeting>,
    private readonly applicationsService: ApplicationsService,
    private readonly usersService: UsersService,
    private readonly zoomMeetingsService: ZoomMeetingsService,
  ) {}

  async getCandidateSlots(
    applicationId: string,
    date: string,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledCandidateById(user_.id)
    const application = await this.applicationsService._findOne({
      id: applicationId,
    })

    if (application.candidate?.id !== user.candidate.id) {
      throw new ForbiddenException(
        "Вы не можете смотреть слоты встречи для этого процесса найма",
      )
    }

    if (!application.funnelStep?.shouldCreateCall) {
      throw new ConflictException(
        "Для этого этапа не требуется назначать встречу",
      )
    }

    if (!application.vacancy?.recruiter?.id) {
      throw new ConflictException("Рекрутер для этого процесса не указан")
    }

    const slots = await this.getAvailableSlotsForRecruiter(
      application.vacancy.recruiter.id,
      date,
    )

    return slots
  }

  async getCandidateMeetings(user_: ICurrentUser, from: string, to: string) {
    const user = await this.usersService.findFilledCandidateById(user_.id)

    return this.getMeetings({
      candidateId: user.candidate.id,
      from,
      to,
    })
  }

  async getRecruiterMeetings(user_: ICurrentUser, from: string, to: string) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    return this.getMeetings({
      recruiterId: user.recruiter.id,
      from,
      to,
    })
  }

  async assertSlotAvailable(
    recruiterId: string,
    meetingStartsAt: string,
    manager?: EntityManager,
  ) {
    const slot = this.parseMeetingStart(meetingStartsAt)
    const slotEnd = new Date(
      slot.getTime() + MEETING_DURATION_MINUTES * 60 * 1000,
    )

    const repo = manager?.getRepository(Meeting) ?? this.meetingsRepo
    const overlapMeeting = await repo
      .createQueryBuilder("meeting")
      .leftJoin("meeting.recruiter", "recruiter")
      .where("recruiter.id = :recruiterId", { recruiterId })
      .andWhere("meeting.startsAt < :slotEnd", { slotEnd })
      .andWhere("meeting.endsAt > :slotStart", { slotStart: slot })
      .getOne()

    if (overlapMeeting) {
      throw new ConflictException("Это время встречи уже недоступно")
    }
  }

  async create(data: DeepPartial<Meeting>, manager?: EntityManager) {
    const repo = manager?.getRepository(Meeting) ?? this.meetingsRepo
    const meeting = repo.create(data)

    return repo.save(meeting)
  }

  createVideoMeetingLink(data: {
    topic: string
    startsAt: Date
    durationMinutes: number
    timezone: string
  }) {
    return this.zoomMeetingsService.createMeeting(data)
  }

  private async getMeetings(params: {
    candidateId?: string
    recruiterId?: string
    from: string
    to: string
  }) {
    const { fromDate, toDate } = this.parseRange(params.from, params.to)

    const qb = this.meetingsRepo
      .createQueryBuilder("meeting")
      .leftJoinAndSelect("meeting.application", "application")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("meeting.funnelStep", "funnelStep")
      .leftJoinAndSelect("meeting.candidate", "candidate")
      .leftJoinAndSelect("meeting.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.company", "company")
      .where("meeting.startsAt < :toDate", { toDate })
      .andWhere("meeting.endsAt > :fromDate", { fromDate })
      .orderBy("meeting.startsAt", "ASC")

    if (params.candidateId) {
      qb.andWhere("candidate.id = :candidateId", {
        candidateId: params.candidateId,
      })
    }

    if (params.recruiterId) {
      qb.andWhere("recruiter.id = :recruiterId", {
        recruiterId: params.recruiterId,
      })
    }

    return qb.getMany()
  }

  private async getAvailableSlotsForRecruiter(
    recruiterId: string,
    date: string,
  ): Promise<MeetingSlot[]> {
    const { workdayStartUtc, workdayEndUtc } = this.getWorkdayUtcBounds(date)
    const busyMeetings = await this.meetingsRepo
      .createQueryBuilder("meeting")
      .leftJoin("meeting.recruiter", "recruiter")
      .where("recruiter.id = :recruiterId", { recruiterId })
      .andWhere("meeting.startsAt < :workdayEndUtc", { workdayEndUtc })
      .andWhere("meeting.endsAt > :workdayStartUtc", { workdayStartUtc })
      .orderBy("meeting.startsAt", "ASC")
      .getMany()

    const now = new Date()
    const slots: MeetingSlot[] = []

    for (
      let hour = MEETING_WORKDAY_START_HOUR;
      hour < MEETING_WORKDAY_END_HOUR;
      hour += 1
    ) {
      const startsAt = this.moscowHourToUtc(date, hour)
      const endsAt = new Date(
        startsAt.getTime() + MEETING_DURATION_MINUTES * 60 * 1000,
      )

      if (startsAt <= now) {
        continue
      }

      const isBusy = busyMeetings.some(
        (meeting) => meeting.startsAt < endsAt && meeting.endsAt > startsAt,
      )

      if (!isBusy) {
        slots.push({
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        })
      }
    }

    return slots
  }

  private parseMeetingStart(meetingStartsAt: string) {
    const slot = new Date(meetingStartsAt)

    if (Number.isNaN(slot.getTime())) {
      throw new BadRequestException("Введите корректную дату и время встречи")
    }

    const slotMoscowDate = this.utcDateToMoscowDate(slot)
    const { workdayStartUtc, workdayEndUtc } =
      this.getWorkdayUtcBounds(slotMoscowDate)

    if (slot < workdayStartUtc || slot >= workdayEndUtc) {
      throw new ConflictException("Время встречи вне рабочего расписания")
    }

    if (
      slot.getUTCMinutes() !== 0 ||
      slot.getUTCSeconds() !== 0 ||
      slot.getUTCMilliseconds() !== 0
    ) {
      throw new ConflictException("Встреча должна начинаться в начале часа")
    }

    if (slot <= new Date()) {
      throw new ConflictException("Встреча должна быть назначена на будущее")
    }

    return slot
  }

  private getWorkdayUtcBounds(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException("Дата должна быть в формате ГГГГ-ММ-ДД")
    }

    return {
      workdayStartUtc: this.moscowHourToUtc(date, MEETING_WORKDAY_START_HOUR),
      workdayEndUtc: this.moscowHourToUtc(date, MEETING_WORKDAY_END_HOUR),
    }
  }

  private parseRange(from: string, to: string) {
    const fromDate = new Date(from)
    const toDate = new Date(to)

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new BadRequestException("Введите корректный диапазон дат")
    }

    if (fromDate >= toDate) {
      throw new BadRequestException("Дата начала должна быть раньше даты конца")
    }

    return { fromDate, toDate }
  }

  private moscowHourToUtc(date: string, hour: number) {
    const [year, month, day] = date.split("-").map(Number)

    return new Date(
      Date.UTC(year, month - 1, day, hour - MOSCOW_UTC_OFFSET_HOURS, 0, 0, 0),
    )
  }

  private utcDateToMoscowDate(date: Date) {
    const moscowDate = new Date(
      date.getTime() + MOSCOW_UTC_OFFSET_HOURS * 60 * 60 * 1000,
    )
    const year = moscowDate.getUTCFullYear()
    const month = String(moscowDate.getUTCMonth() + 1).padStart(2, "0")
    const day = String(moscowDate.getUTCDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }
}
