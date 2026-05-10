"use client"

import dayjs from "dayjs"
import Image from "next/image"

import { useApplications } from "@/api/applications/get-applications"
import RemoteData from "@/components/ui/RemoteData"
import ApplicationStatusMarker from "@/components/base/application/ApplicationStatus"
import { getCompanyLogo } from "@/lib/get-company-logo"
import {
  Application,
  ApplicationStatus,
  ApplicationType,
} from "@/types/entities/application"
import {
  ApplicationMessage,
  ApplicationMessageType,
} from "@/types/entities/application-message"
import { UserRole } from "@/types/entities/user"

interface Props {
  candidateId: string
}

const terminalMessageTypes: ApplicationMessageType[] = [
  ApplicationMessageType.RecruiterRejected,
  ApplicationMessageType.CandidateRejected,
  ApplicationMessageType.VacancyArchived,
  ApplicationMessageType.RecruiterOfferedJob,
]

const rejectionMessageTypes: ApplicationMessageType[] = [
  ApplicationMessageType.RecruiterRejected,
  ApplicationMessageType.CandidateRejected,
  ApplicationMessageType.VacancyArchived,
]

const getTerminalMessage = (messages: ApplicationMessage[] = []) => {
  for (let idx = messages.length - 1; idx >= 0; idx--) {
    if (terminalMessageTypes.includes(messages[idx].type)) {
      return messages[idx]
    }
  }

  return null
}

const getRejectionMessage = (messages: ApplicationMessage[] = []) => {
  let rejectionMessageIndex = -1

  for (let idx = messages.length - 1; idx >= 0; idx--) {
    if (rejectionMessageTypes.includes(messages[idx].type)) {
      rejectionMessageIndex = idx
      break
    }
  }

  if (rejectionMessageIndex === -1) {
    return null
  }

  return {
    message: messages[rejectionMessageIndex],
    index: rejectionMessageIndex,
  }
}

const getManualRejectionReason = (
  messages: ApplicationMessage[] = [],
  rejectionMessage: ApplicationMessage,
  rejectionMessageIndex: number,
) => {
  const reasonMessageAfter = messages
    .slice(rejectionMessageIndex + 1)
    .find(
      (message) =>
        message.type === ApplicationMessageType.UserMessage &&
        message.senderRole === rejectionMessage.senderRole &&
        message.content,
    )

  if (reasonMessageAfter?.content) {
    return reasonMessageAfter.content
  }

  const reasonMessageBefore = messages
    .slice(0, rejectionMessageIndex)
    .reverse()
    .find(
      (message) =>
        message.type === ApplicationMessageType.UserMessage &&
        message.senderRole === rejectionMessage.senderRole &&
        message.content,
    )

  if (reasonMessageBefore?.content) {
    return reasonMessageBefore.content
  }

  return null
}

const getApplicationDateLabel = (application: Application) => {
  const terminalMessage = getTerminalMessage(application.messages)
  const startedAt = dayjs(application.createdAt).format("DD MMMM YYYY")

  if (!terminalMessage || application.status === ApplicationStatus.Pending) {
    return `от ${startedAt}`
  }

  return `${startedAt} - ${dayjs(terminalMessage.createdAt).format(
    "DD MMMM YYYY",
  )}`
}

const getRejectedAtLabel = (application: Application) => {
  const rejection = getRejectionMessage(application.messages)

  if (!rejection) {
    return null
  }

  if (rejection.message.type === ApplicationMessageType.VacancyArchived) {
    return "Отклонено рекрутером из-за архивирования вакансии"
  }

  const actor =
    rejection.message.type === ApplicationMessageType.RecruiterRejected
      ? "рекрутером"
      : "соискателем"
  const reason = getManualRejectionReason(
    application.messages,
    rejection.message,
    rejection.index,
  )

  return reason
    ? `Отклонено ${actor} с сообщением "${reason}"`
    : `Отклонено ${actor}`
}

const CandidateApplicationsHistoryItem = ({
  application,
}: {
  application: Application
}) => {
  if (!application.vacancy) {
    return null
  }

  const vacancy = application.vacancy
  const company = vacancy.recruiter?.company
  const rejectedAtLabel = getRejectedAtLabel(application)

  return (
    <div className="group relative flex gap-3 pt-3 first:pt-0">
      <Image
        className="shrink-0 w-7 h-7 rounded-full object-contain"
        src={getCompanyLogo(company)}
        width={120}
        height={120}
        alt=""
      />

      <div className="flex flex-col gap-1 grow min-w-0 pb-3 border-b border-border group-[:last-child]:border-b-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5 text-sm text-secondary-light flex-wrap">
            <span>{getApplicationDateLabel(application)}</span>
            <ApplicationStatusMarker status={application.status} />
          </div>
          <p className="text-sm border border-border rounded px-1.5 py-0.5">
            {
              (
                {
                  [ApplicationType.Invitation]: "Приглашение от рекрутера",
                  [ApplicationType.Response]: "Отклик на вакансию",
                } as const
              )[application.type]
            }
          </p>
        </div>

        <div className="flex items-baseline min-w-0 -mt-0.5 flex-wrap">
          <h3 className="text-h4">{vacancy.title}</h3>
          {company && (
            <p className="text-sm text-fg-heading">, {company.name}</p>
          )}
        </div>

        {application.status === ApplicationStatus.Rejected &&
          rejectedAtLabel && (
            <p className="text-sm whitespace-pre-wrap">{rejectedAtLabel}</p>
          )}
      </div>
    </div>
  )
}

export default function CandidateApplicationsHistory({ candidateId }: Props) {
  const applications = useApplications({
    role: UserRole.Recruiter,
    candidateId,
  })

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-h5">История откликов</h2>

      <RemoteData
        data={applications}
        onSuccess={(applications) => {
          const completedApplications = applications.filter(
            (application) => application.status !== ApplicationStatus.Pending,
          )

          return completedApplications.length ? (
            <div className="flex flex-col">
              {completedApplications.map((application) => (
                <CandidateApplicationsHistoryItem
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          ) : (
            <p className="text-secondary-light">Здесь пока пуста</p>
          )
        }}
      />
    </div>
  )
}
