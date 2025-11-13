import { useMemo } from "react"

import { Application, ApplicationStatus } from "@/types/entities/application"
import { Vacancy } from "@/types/entities/vacancy"

interface Args {
  vacancy: Vacancy
  application: Application
}

interface Step {
  name: string
  status: "passed" | "upcoming" | "approved" | "rejected" | "pending"
}

export const useSteps = ({ vacancy, application }: Args) =>
  useMemo(() => {
    const steps: Step[] = [
      {
        name: "Отклик создан",
        status: (
          {
            [ApplicationStatus.Approved]: "passed",
            [ApplicationStatus.Rejected]: "passed",
            [ApplicationStatus.Pending]: "pending",
          } as const
        )[application.status],
      },
    ]

    if (
      vacancy.funnelSteps &&
      !(
        (application.status === ApplicationStatus.Approved ||
          application.status === ApplicationStatus.Rejected) &&
        !application.funnelStep
      )
    ) {
      if (application.funnelStep) {
        steps[0].status = "passed"
      }

      let isFutureFunnelStep = application.funnelStep ? false : true

      for (const funnelStep of vacancy.funnelSteps) {
        const isCurrentFunnelStep = application.funnelStep?.id === funnelStep.id

        steps.push({
          name: funnelStep.name,
          status: isFutureFunnelStep
            ? "upcoming"
            : isCurrentFunnelStep
            ? (
                {
                  [ApplicationStatus.Approved]: "passed",
                  [ApplicationStatus.Rejected]: "passed",
                  [ApplicationStatus.Pending]: "pending",
                } as const
              )[application.status]
            : "passed",
        })

        if (
          isCurrentFunnelStep &&
          (application.status === ApplicationStatus.Approved ||
            application.status === ApplicationStatus.Rejected)
        ) {
          break
        }

        if (isCurrentFunnelStep) {
          isFutureFunnelStep = true
        }
      }
    }

    steps.push({
      name: {
        [ApplicationStatus.Pending]: "Трудоустройство",
        [ApplicationStatus.Approved]: "Принят",
        [ApplicationStatus.Rejected]: "Отклонен",
      }[application.status],
      status: (
        {
          [ApplicationStatus.Pending]: "upcoming",
          [ApplicationStatus.Approved]: "approved",
          [ApplicationStatus.Rejected]: "rejected",
        } as const
      )[application.status],
    })

    return steps
  }, [vacancy, application])
