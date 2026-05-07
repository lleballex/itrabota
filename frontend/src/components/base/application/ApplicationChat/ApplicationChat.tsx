import classNames from "classnames"
import dayjs from "dayjs"
import Image from "next/image"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"

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
import ApplicationMeetingModal from "@/components/base/application/ApplicationMeetingModal"
import { formatMeetingDateTime } from "@/lib/meeting"

interface Props {
  application: Application
  vacancy: Vacancy
  role: UserRole
}

export default function ApplicationChat({ application, vacancy, role }: Props) {
  const interlocutorRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [interlocutorHeight, setInterlocutorHeight] = useState(0)
  const [controlsHeight, setControlsHeight] = useState(0)
  const [messagesScrollShadow, setMessagesScrollShadow] = useState({
    bottom: false,
  })
  const [isRejectModalActive, setIsRejectModalActive] = useState(false)
  const [isOfferModalActive, setIsOfferModalActive] = useState(false)
  const [isMeetingModalActive, setIsMeetingModalActive] = useState(false)

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

  const hasMeetingForCurrentStep = useMemo(
    () =>
      application.meetings?.some(
        (meeting) => meeting.funnelStep?.id === application.funnelStep?.id,
      ) ?? false,
    [application],
  )

  const hasControls =
    application.status === ApplicationStatus.Pending &&
    (role === UserRole.Recruiter || role === UserRole.Candidate)

  useLayoutEffect(() => {
    const interlocutor = interlocutorRef.current

    if (!interlocutor) {
      setInterlocutorHeight(0)
      return
    }

    const updateInterlocutorHeight = () => {
      setInterlocutorHeight(interlocutor.offsetHeight)
    }

    updateInterlocutorHeight()

    const resizeObserver = new ResizeObserver(updateInterlocutorHeight)
    resizeObserver.observe(interlocutor)

    return () => resizeObserver.disconnect()
  }, [man])

  useLayoutEffect(() => {
    const controls = controlsRef.current

    if (!controls) {
      setControlsHeight(0)
      return
    }

    const updateControlsHeight = () => {
      setControlsHeight(controls.offsetHeight)
    }

    updateControlsHeight()

    const resizeObserver = new ResizeObserver(updateControlsHeight)
    resizeObserver.observe(controls)

    return () => resizeObserver.disconnect()
  }, [hasControls, isWaitingForCandidateResponse, nextFunnelStep])

  const updateMessagesScrollShadow = useCallback(() => {
    const messagesContainer = messagesContainerRef.current

    if (!messagesContainer) return

    const maxScrollTop =
      messagesContainer.scrollHeight - messagesContainer.clientHeight

    setMessagesScrollShadow({
      bottom: messagesContainer.scrollTop < maxScrollTop - 1,
    })
  }, [])

  useLayoutEffect(() => {
    const messagesContainer = messagesContainerRef.current

    if (!messagesContainer) return

    messagesContainer.scrollTop = messagesContainer.scrollHeight
    updateMessagesScrollShadow()
  }, [
    application.messages,
    controlsHeight,
    interlocutorHeight,
    updateMessagesScrollShadow,
  ])

  const onAccept = () => {
    if (application.funnelStep?.shouldCreateCall && !hasMeetingForCurrentStep) {
      setIsMeetingModalActive(true)
      return
    }

    acceptApplicationByCandidate({
      applicationId: application.id,
    })
  }

  const getMeetingLinkMessageSuffix = (message: ApplicationMessage) => {
    if (!message.meeting) {
      return ""
    }

    if (!message.meeting.link) {
      return ". Ссылку на встречу создать не удалось"
    }

    return (
      <>
        . Ссылка на встречу:{" "}
        <a
          className="break-all text-primary underline transition hover:opacity-70"
          href={message.meeting.link}
          rel="noreferrer"
          target="_blank"
        >
          {message.meeting.link}
        </a>
      </>
    )
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
          ? "Вы приняли кандидата"
          : "Рекрутер принял вас на работу"
      case ApplicationMessageType.CandidateRejected:
        return role === UserRole.Candidate
          ? "Вы завершили процесс найма"
          : "Кандидат завершил процесс найма"
      case ApplicationMessageType.RecruiterRejected:
        return role === UserRole.Recruiter
          ? "Вы завершили процесс найма"
          : "Рекрутер завершил процесс найма"
      case ApplicationMessageType.VacancyArchived:
        return role === UserRole.Recruiter
          ? "Вы архивировали вакансию, процесс найма завершен"
          : "Вакансия архивирована, процесс найма завершен"
      case ApplicationMessageType.MeetingScheduled:
        if (!message.meeting) {
          return role === UserRole.Candidate
            ? "Вы назначили встречу"
            : "Кандидат назначил встречу"
        }

        return (
          <>
            {role === UserRole.Candidate
              ? `Вы назначили встречу на ${formatMeetingDateTime(
                  message.meeting.startsAt,
                )}`
              : `Кандидат назначил встречу на ${formatMeetingDateTime(
                  message.meeting.startsAt,
                )}`}
            {getMeetingLinkMessageSuffix(message)}
          </>
        )
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
      <div className="relative flex flex-col gap-2 grow h-full min-h-0">
        {man && (
          <div
            ref={interlocutorRef}
            className="flex items-center gap-2 absolute top-0 left-0 right-0 z-10 pb-2 bg-linear-to-b from-bg from-[calc(100%-32px)] to-transparent"
          >
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
        <div className="relative grow min-h-0">
          <div
            ref={messagesContainerRef}
            className="h-full overflow-y-auto"
            onScroll={updateMessagesScrollShadow}
          >
            <div
              className="flex flex-col gap-1 min-h-full justify-end"
              style={{
                paddingTop: interlocutorHeight,
                paddingBottom: controlsHeight,
              }}
            >
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
          </div>
          {!hasControls && (
            <span
              className={classNames(
                "pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-bg to-transparent transition-opacity",
                {
                  "opacity-100": messagesScrollShadow.bottom,
                  "opacity-0": !messagesScrollShadow.bottom,
                },
              )}
            />
          )}
        </div>

        {hasControls && (
          <div
            ref={controlsRef}
            className="absolute bottom-0 left-0 right-0 z-10 flex justify-center bg-linear-to-t from-bg from-[calc(100%-32px)] to-transparent pt-2"
          >
            {role === UserRole.Recruiter && (
              <div className="flex gap-2">
                {!isWaitingForCandidateResponse && (
                  <Button
                    type="glass"
                    onClick={() => setIsOfferModalActive(true)}
                  >
                    {nextFunnelStep
                      ? `Пригласить на ${nextFunnelStep?.name}`
                      : "Принять на работу"}
                  </Button>
                )}
                <Button
                  className="!text-danger"
                  type="glass"
                  onClick={() => setIsRejectModalActive(true)}
                >
                  {isWaitingForCandidateResponse ? "Завершить" : "Отказать"}
                </Button>
              </div>
            )}

            {role === UserRole.Candidate && (
              <div className="flex gap-2">
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
                  {isWaitingForCandidateResponse ? "Отклонить" : "Завершить"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ApplicationRejectModal
        application={application}
        vacancy={vacancy}
        role={role}
        active={isRejectModalActive}
        onActiveChange={setIsRejectModalActive}
      />

      <ApplicationOfferModal
        application={application}
        vacancy={vacancy}
        active={isOfferModalActive}
        onActiveChange={setIsOfferModalActive}
      />

      <ApplicationMeetingModal
        application={application}
        active={isMeetingModalActive}
        onActiveChange={setIsMeetingModalActive}
      />
    </>
  )
}
