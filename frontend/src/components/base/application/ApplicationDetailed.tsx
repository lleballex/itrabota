import classNames from "classnames"
import dayjs from "dayjs"
import Image from "next/image"

import { getCompanyLogo } from "@/lib/get-company-logo"
import { Application } from "@/types/entities/application"
import {
  ApplicationMessage,
  ApplicationMessageType,
} from "@/types/entities/application-message"
import { User, UserRole } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"

import { useSteps } from "./use-steps"

interface Props {
  application: Application
  vacancy: Vacancy
  me: User
}

export default function ApplicationDetailed({
  application,
  vacancy,
  me,
}: Props) {
  const steps = useSteps({ vacancy, application })

  const getMessageContent = (message: ApplicationMessage) => {
    switch (message.type) {
      case ApplicationMessageType.UserMessage:
        return message.content
      case ApplicationMessageType.CandidateResponded:
        return me.role === UserRole.Candidate
          ? "Вы откилкнулись на вакансию"
          : "Кандидат откилкнулся на вакансию"
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
    <div className="flex items-start gap-6">
      <div className="flex flex-col gap-2 grow">
        {vacancy.recruiter && (
          <div className="flex items-center gap-2">
            <Image
              className="w-7 h-7 rounded-full"
              src={getCompanyLogo(vacancy.recruiter.company)}
              width={50}
              height={50}
              alt=""
            />
            <div>
              <p>{vacancy.recruiter.firstName}</p>
              <p className="text-sm">{vacancy.recruiter.company?.name}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {application.messages?.map((message) => (
            <div
              className={classNames(
                "py-1 px-2 max-w-2/3 bg-secondary whitespace-pre-wrap rounded",
                {
                  "self-end text-right": message.senderRole === me.role,
                  "self-start": message.senderRole !== me.role,
                }
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
        {/* <div className="flex self-center gap-2 sticky bottom-[var(--spacing-screen)]">
          <Button className="!text-danger" type="glass">
            Отказать
          </Button>
          <Button className="" type="glass">
            Назначить интервью
          </Button>
        </div> */}
      </div>

      {/* TODO: move colors to config */}
      <div className="flex flex-col gap-2 max-w-[300px] relative">
        <span className="absolute top-1.5 bottom-1.5 left-[calc((var(--spacing)*1.5-1px)*0.5)] w-[1px] bg-[#333] z-[-1]" />
        {steps.map((step) => (
          <div className="flex items-center gap-1" key={step.name}>
            <span
              className={classNames(
                "block w-1.5 h-1.5 rounded-full",
                {
                  upcoming: "border border-[#333] bg-bg",
                  approved: "bg-success",
                  pending: "bg-[#fffb00]",
                  rejected: "bg-danger",
                  passed: "bg-[#333]",
                }[step.status]
              )}
            />
            {step.name}
          </div>
        ))}
      </div>
    </div>
  )
}
