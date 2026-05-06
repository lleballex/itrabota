"use client"

import dayjs from "dayjs"
import { useEffect, useState } from "react"

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

const getVacancyUrl = (meeting: Meeting, role: UserRole) => {
  const vacancyId = meeting.application?.vacancy?.id

  if (!vacancyId) {
    return
  }

  return role === UserRole.Recruiter
    ? Routes.recruiter.vacancy(vacancyId)
    : Routes.candidate.vacancy(vacancyId)
}

export default function MeetingCalendarEventModal({
  active,
  meeting,
  onActiveChange,
  role,
}: Props) {
  const [displayedMeeting, setDisplayedMeeting] = useState<Meeting | null>(
    meeting,
  )

  useEffect(() => {
    if (meeting) {
      setDisplayedMeeting(meeting)
    }
  }, [meeting])

  if (!displayedMeeting) {
    return null
  }

  const processUrl = getProcessUrl(displayedMeeting, role)
  const vacancyUrl = getVacancyUrl(displayedMeeting, role)
  const meetingDateTime = `${dayjs
    .utc(displayedMeeting.startsAt)
    .tz(displayedMeeting.timezone)
    .format("D MMMM")} ${formatMeetingTimeRange(
    displayedMeeting.startsAt,
    displayedMeeting.endsAt,
  )}`
  const meetingLink =
    displayedMeeting.link || "https://example.com/test-meeting"
  const vacancyTitle = displayedMeeting.application?.vacancy?.title ?? "Встреча"
  const candidateName = getCandidateName(displayedMeeting) || "Не указано"
  const candidateUrl = displayedMeeting.candidate?.id
    ? Routes.recruiter.candidate(displayedMeeting.candidate.id)
    : null
  const companyName =
    displayedMeeting.recruiter?.company?.name ||
    getRecruiterName(displayedMeeting) ||
    "Не указано"

  const closeModal = () => {
    onActiveChange(false)
  }

  return (
    <Modal.Root active={active} onActiveChange={onActiveChange} width={620}>
      <Modal.Header>Детали встречи</Modal.Header>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-fg">Ссылка</p>
          <a
            className="break-all underline text-primary transition-all hover:opacity-70"
            href={meetingLink}
            rel="noreferrer"
            target="_blank"
          >
            {meetingLink}
          </a>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-fg">Дата и время</p>
          <p>{meetingDateTime}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-fg">Вакансия</p>
          {vacancyUrl ? (
            <a
              className="break-all underline text-primary transition-all hover:opacity-70"
              href={vacancyUrl}
              rel="noreferrer"
              target="_blank"
            >
              {vacancyTitle}
            </a>
          ) : (
            <p>{vacancyTitle}</p>
          )}
        </div>

        {role === UserRole.Recruiter ? (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-fg">Кандидат</p>
            {candidateUrl ? (
              <a
                className="break-all underline text-primary transition-all hover:opacity-70"
                href={candidateUrl}
                rel="noreferrer"
                target="_blank"
              >
                {candidateName}
              </a>
            ) : (
              <p>{candidateName}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-fg">Компания</p>
            <p className="text-lg font-bold text-fg-heading">{companyName}</p>
          </div>
        )}
      </div>

      <Modal.Controls>
        <Button type="secondary" onClick={closeModal}>
          Закрыть
        </Button>
        {processUrl && (
          <Button
            type="primary"
            link={{
              url: processUrl,
            }}
          >
            Перейти к процессу
          </Button>
        )}
      </Modal.Controls>
    </Modal.Root>
  )
}
