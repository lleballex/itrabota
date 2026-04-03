import classNames from "classnames"

import { Application } from "@/types/entities/application"
import { User } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"
import ApplicationChat from "@/components/base/application/ApplicationChat"

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

  return (
    <div className="flex items-start gap-6">
      <ApplicationChat
        role={me.role}
        application={application}
        vacancy={vacancy}
      />

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
