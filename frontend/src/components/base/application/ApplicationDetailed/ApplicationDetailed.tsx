import classNames from "classnames"
import { useMemo, useState } from "react"

import { Application } from "@/types/entities/application"
import { User, UserRole } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"
import ApplicationChat from "@/components/base/application/ApplicationChat"
import Button from "@/components/ui/Button"
import { useApplicationStageResults } from "@/api/applications/get-application-stage-results"
import { ApplicationStatus } from "@/types/entities/application"
import { ApplicationStageResult } from "@/types/entities/application-stage-result"
import ApplicationStageResultModal from "@/components/base/application/ApplicationStageResultModal"
import ApplicationStageResultsHistoryModal from "@/components/base/application/ApplicationStageResultsHistoryModal"
import { isWaitingForCandidateResponse } from "@/components/base/application/application-helpers"

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
  const [isStageResultModalActive, setIsStageResultModalActive] =
    useState(false)
  const [
    isStageResultsHistoryModalActive,
    setIsStageResultsHistoryModalActive,
  ] = useState(false)
  const stageResults = useApplicationStageResults(
    {
      applicationId: application.id,
    },
    { isEnabled: me.role === UserRole.Recruiter },
  )

  const currentFunnelStep = useMemo(() => {
    if (!application.funnelStep) {
      return null
    }

    return (
      vacancy.funnelSteps?.find(
        (step) => step.id === application.funnelStep?.id,
      ) ?? application.funnelStep
    )
  }, [application.funnelStep, vacancy.funnelSteps])

  const currentStageResult = useMemo(() => {
    if (stageResults.status !== "success" || !application.funnelStep?.id) {
      return null
    }

    return (
      stageResults.data.find(
        (stageResult) =>
          stageResult.funnelStep?.id === application.funnelStep?.id,
      ) ?? null
    )
  }, [
    application.funnelStep?.id,
    stageResults,
  ]) as ApplicationStageResult | null

  const isCurrentStageResultActionVisible = useMemo(
    () =>
      me.role === UserRole.Recruiter &&
      application.status === ApplicationStatus.Pending &&
      Boolean(application.funnelStep) &&
      !isWaitingForCandidateResponse(application),
    [application, me.role],
  )

  return (
    <>
      <div className="flex items-start gap-6 h-full min-h-0 overflow-hidden">
        <ApplicationChat
          role={me.role}
          application={application}
          vacancy={vacancy}
        />

        <div className="flex justify-between h-full w-full max-w-[220px] shrink-0 flex-col gap-4">
          <div className="relative flex flex-col gap-2">
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
                    }[step.status],
                  )}
                />
                {step.name}
              </div>
            ))}
          </div>

          {me.role === UserRole.Recruiter && (
            <div className="flex flex-col gap-2 rounded-2xl">
              <Button
                className="self-center"
                type="text"
                onClick={() => setIsStageResultsHistoryModalActive(true)}
              >
                Результаты
              </Button>
              {isCurrentStageResultActionVisible && currentFunnelStep && (
                <>
                  <Button
                    type="secondary"
                    onClick={() => setIsStageResultModalActive(true)}
                  >
                    Заполнить результат
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {me.role === UserRole.Recruiter && currentFunnelStep && (
        <ApplicationStageResultModal
          application={application}
          currentStageName={currentFunnelStep.name}
          stageResult={currentStageResult}
          active={isStageResultModalActive}
          onActiveChange={setIsStageResultModalActive}
        />
      )}

      {me.role === UserRole.Recruiter && (
        <ApplicationStageResultsHistoryModal
          active={isStageResultsHistoryModalActive}
          onActiveChange={setIsStageResultsHistoryModalActive}
          funnelSteps={vacancy.funnelSteps}
          stageResults={stageResults}
        />
      )}
    </>
  )
}
