"use client"

import dayjs from "dayjs"

import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import { Routes } from "@/config/routes"
import { formatMeetingTimeRange } from "@/lib/meeting"
import { Meeting } from "@/types/entities/meeting"
import { UserRole } from "@/types/entities/user"

interface Props {
  active: boolean
  meeting: Meeting | null
  onActiveChange: (val: boolean) => void
  role: UserRole
}

const getCandidateName = (meeting: Meeting) =>
  [
    meeting.candidate?.lastName,
    meeting.candidate?.firstName,
    meeting.candidate?.patronymic,
  ]
    .filter(Boolean)
    .join(" ")

const getRecruiterName = (meeting: Meeting) =>
  [
    meeting.recruiter?.lastName,
    meeting.recruiter?.firstName,
    meeting.recruiter?.patronymic,
  ]
    .filter(Boolean)
    .join(" ")

const getProcessUrl = (meeting: Meeting, role: UserRole) => {
  const applicationId = meeting.application?.id
  const vacancyId = meeting.application?.vacancy?.id

  if (role === UserRole.Recruiter && applicationId) {
    return Routes.recruiter.application(applicationId)
  }

  if (role === UserRole.Candidate && vacancyId) {
    return Routes.candidate.vacancy(vacancyId, { tab: "application" })
  }
}

export default function MeetingCalendarEventModal({
  active,
  meeting,
  onActiveChange,
  role,
}: Props) {
  if (!meeting) {
    return null
  }

  const processUrl = getProcessUrl(meeting, role)
  const counterpartyLabel =
    role === UserRole.Candidate ? "Компания / рекрутер" : "Соискатель"
  const counterpartyValue =
    role === UserRole.Candidate
      ? meeting.recruiter?.company?.name ||
        getRecruiterName(meeting) ||
        "Не указано"
      : getCandidateName(meeting) || "Не указано"

  return (
    <Modal.Root active={active} onActiveChange={onActiveChange} width={560}>
      <Modal.Header>Детали встречи</Modal.Header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-h4">
            {meeting.application?.vacancy?.title ?? "Встреча"}
          </p>
          <p className="text-sm text-fg">
            {dayjs.utc(meeting.startsAt).tz(meeting.timezone).format("D MMMM YYYY")}
            , {formatMeetingTimeRange(meeting.startsAt, meeting.endsAt)}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-secondary px-3 py-2">
            <p className="text-xs uppercase text-fg">Этап</p>
            <p className="text-base text-fg-heading">
              {meeting.funnelStep?.name ?? "Не указан"}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-secondary px-3 py-2">
            <p className="text-xs uppercase text-fg">{counterpartyLabel}</p>
            <p className="text-base text-fg-heading">{counterpartyValue}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-secondary px-3 py-2">
          <p className="text-xs uppercase text-fg">Ссылка на встречу</p>

          {meeting.link ? (
            <a
              className="text-base font-bold text-primary transition-all hover:opacity-70"
              href={meeting.link}
              rel="noreferrer"
              target="_blank"
            >
              {meeting.link}
            </a>
          ) : (
            <p className="text-base text-fg">
              Ссылка появится после подключения автогенерации.
            </p>
          )}
        </div>
      </div>

      <Modal.Controls>
        {processUrl ? (
          <Button
            type="primary"
            link={{
              url: processUrl,
            }}
          >
            Перейти к процессу
          </Button>
        ) : (
          <Button type="secondary" onClick={() => onActiveChange(false)}>
            Процесс недоступен
          </Button>
        )}

        <Button type="secondary" onClick={() => onActiveChange(false)}>
          Закрыть
        </Button>
      </Modal.Controls>
    </Modal.Root>
  )
}
