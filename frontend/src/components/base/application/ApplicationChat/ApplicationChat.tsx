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

interface Props {
  application: Application
  vacancy: Vacancy
  role: UserRole
}

export default function ApplicationChat({ application, vacancy, role }: Props) {
  const [isRejectModalActive, setIsRejectModalActive] = useState(false)
  const isPending = application.status === ApplicationStatus.Pending

  // TODO: rename
  const man = {
    [UserRole.Recruiter]: application.candidate,
    [UserRole.Candidate]: vacancy.recruiter,
  }[role]

  const nextFunnelStep = useMemo(() => {
    if (!vacancy.funnelSteps) return null

    const curStepIdx = vacancy.funnelSteps.findIndex(
      (step) => step.id === application.funnelStep?.id,
    )

    return vacancy.funnelSteps[curStepIdx + 1] ?? null
  }, [vacancy, application])

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
        {role === UserRole.Recruiter && isPending && (
          <div className="flex self-center gap-2 sticky bottom-[var(--spacing-screen)]">
            {nextFunnelStep ? (
              <Button type="glass">Пригласить на {nextFunnelStep.name}</Button>
            ) : (
              <Button type="glass">Принять</Button>
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
        {role === UserRole.Candidate && isPending && (
          <div className="flex self-center sticky bottom-[var(--spacing-screen)]">
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
    </>
  )
}
