import classNames from "classnames"
import dayjs from "dayjs"
import Image from "next/image"
import { useMemo, useState } from "react"

import { Application, ApplicationStatus } from "@/types/entities/application"
import {
  ApplicationMessage,
  ApplicationMessageType,
} from "@/types/entities/application-message"
import { UserRole } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"
import { getProfileAvatar } from "@/lib/get-profile-avatar"
import Button from "@/components/ui/Button"
import ApplicationRejectModal from "@/components/base/application/ApplicationRejectModal"
import { useAcceptApplicationByCandidate } from "@/api/applications/accept-application-by-candidate"
import ApplicationOfferModal from "@/components/base/application/ApplicationOfferModal"

interface Props {
  application: Application
  vacancy: Vacancy
  role: UserRole
}

export default function ApplicationChat({ application, vacancy, role }: Props) {
  const [isRejectModalActive, setIsRejectModalActive] = useState(false)
  const [isOfferModalActive, setIsOfferModalActive] = useState(false)

  const {
    mutate: acceptApplicationByCandidate,
    status: acceptApplicationByCandidateStatus,
  } = useAcceptApplicationByCandidate()

  // TODO: rename
  const man = {
    [UserRole.Recruiter]: application.candidate,
    [UserRole.Candidate]: vacancy.recruiter,
  }[role]

  const nextFunnelStep = useMemo(() => {
    if (!vacancy.funnelSteps?.length) return null

    const curStepIdx = vacancy.funnelSteps.findIndex(
      (step) => step.id === application.funnelStep?.id,
    )

    return vacancy.funnelSteps[curStepIdx + 1] ?? null
  }, [vacancy, application])

  const isWaitingForCandidateResponse = useMemo(() => {
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
  }, [application])

  const onAccept = () => {
    acceptApplicationByCandidate({
      applicationId: application.id,
    })
  }

  const getMessageContent = (message: ApplicationMessage) => {
    switch (message.type) {
      case ApplicationMessageType.UserMessage:
        return message.content
      case ApplicationMessageType.CandidateResponded:
        return role === UserRole.Candidate
          ? "Вы откликнулись на вакансию"
          : "Кандидат откликнулся на вакансию"
      case ApplicationMessageType.RecruiterInvited:
        return role === UserRole.Recruiter
          ? "Вы пригласили кандидата на вакансию"
          : "Рекрутер пригласил вас на вакансию"
      case ApplicationMessageType.CandidateAccepted:
        return role === UserRole.Candidate
          ? "Вы приняли приглашение"
          : "Кандидат принял приглашение"
      case ApplicationMessageType.RecruiterOfferedStep:
        return role === UserRole.Recruiter
          ? "Вы пригласили кандидата на следующий этап"
          : "Рекрутер пригласил вас на следующий этап"
      case ApplicationMessageType.RecruiterOfferedJob:
        return role === UserRole.Recruiter
          ? "Вы пригласили кандидата трудоустроиться"
          : "Рекрутер пригласил вас трудоустроиться"
      case ApplicationMessageType.CandidateRejected:
        return role === UserRole.Candidate
          ? "Вы отклонили процесс найма"
          : "Кандидат отклонил процесс найма"
      case ApplicationMessageType.RecruiterRejected:
        return role === UserRole.Recruiter
          ? "Вы отклонили соискателя"
          : "Рекрутер отклонил процесс найма"
    }
  }

  const getMessageCreatedAt = (message: ApplicationMessage) => {
    if (dayjs(message.createdAt).isSame(dayjs(), "day")) {
      return dayjs(message.createdAt).format("HH:mm")
    } else {
      return dayjs(message.createdAt).format("D MMMM HH:mm")
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 grow">
        {man && (
          <div className="flex items-center gap-2">
            <Image
              className="w-7 h-7 rounded-full"
              src={getProfileAvatar({
                profile: man,
                role: {
                  [UserRole.Recruiter]: UserRole.Candidate,
                  [UserRole.Candidate]: UserRole.Recruiter,
                }[role],
              })}
              width={50}
              height={50}
              alt=""
            />
            <div>
              <p>
                {man.firstName} {man.lastName}
              </p>
              {"company" in man && man.company && (
                <p className="text-sm">{man.company.name}</p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {application.messages?.map((message) => (
            <div
              className={classNames(
                "py-1 px-2 max-w-2/3 bg-secondary whitespace-pre-wrap rounded",
                {
                  "self-end text-right": message.senderRole === role,
                  "self-start": message.senderRole !== role,
                },
              )}
              key={message.id}
            >
              <p>{getMessageContent(message)}</p>
              <p className="text-xs text-[#888]">
                {getMessageCreatedAt(message)}
              </p>
            </div>
          ))}
        </div>

        {role === UserRole.Recruiter &&
          application.status === ApplicationStatus.Pending && (
            <div className="flex self-center gap-2 sticky bottom-[var(--spacing-screen)]">
              {!isWaitingForCandidateResponse && (
                <Button
                  type="glass"
                  onClick={() => setIsOfferModalActive(true)}
                >
                  Пригласить на {nextFunnelStep?.name}
                </Button>
              )}
              <Button
                className="!text-danger"
                type="glass"
                onClick={() => setIsRejectModalActive(true)}
              >
                Отказать
              </Button>
            </div>
          )}

        {role === UserRole.Candidate &&
          application.status === ApplicationStatus.Pending && (
            <div className="flex self-center gap-2 sticky bottom-[var(--spacing-screen)]">
              {isWaitingForCandidateResponse && (
                <Button
                  type="glass"
                  pending={acceptApplicationByCandidateStatus === "pending"}
                  onClick={onAccept}
                >
                  Принять
                </Button>
              )}
              <Button
                className="!text-danger"
                type="glass"
                onClick={() => setIsRejectModalActive(true)}
              >
                Отклонить процесс
              </Button>
            </div>
          )}
      </div>

      <ApplicationRejectModal
        application={application}
        role={role}
        active={isRejectModalActive}
        onActiveChange={setIsRejectModalActive}
      />

      <ApplicationOfferModal
        application={application}
        active={isOfferModalActive}
        onActiveChange={setIsOfferModalActive}
      />
    </>
  )
}
