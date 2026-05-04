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
    <div className="flex items-start gap-6 h-full min-h-0 overflow-hidden">
      <ApplicationChat
        role={me.role}
        application={application}
        vacancy={vacancy}
      />

      <div className="flex flex-col gap-2 max-w-[300px] shrink-0 relative overflow-y-auto">
        <span className="absolute top-1.5 bottom-1.5 left-[calc((var(--spacing)*1.5-1px)*0.5)] w-[1px] bg-border z-[-1]" />
        {steps.map((step) => (
          <div className="flex items-center gap-1" key={step.name}>
            <span
              className={classNames(
                "block w-1.5 h-1.5 rounded-full",
                {
                  upcoming: "border border-border bg-bg",
                  approved: "bg-success",
                  pending: "bg-[#f5c542]",
                  rejected: "bg-danger",
                  passed: "bg-border",
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
