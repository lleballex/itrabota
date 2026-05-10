"use client"

import dayjs from "dayjs"

import Modal from "@/components/ui/Modal"
import { ApplicationStageRecommendationLabels } from "@/types/entities/application-stage-result"
import { FunnelStep } from "@/types/entities/funnel-step"
import { RemoteData as IRemoteData } from "@/types/remote-data"
import RemoteData from "@/components/ui/RemoteData"

import { ApplicationStageResult } from "@/types/entities/application-stage-result"

interface Props {
  active: boolean
  onActiveChange: (val: boolean) => void
  funnelSteps?: FunnelStep[]
  stageResults: IRemoteData<ApplicationStageResult[], Error>
}

const getRecruiterName = (stageResult: ApplicationStageResult) => {
  const recruiter = stageResult.authorRecruiter

  if (!recruiter) {
    return null
  }

  return [recruiter.firstName, recruiter.lastName].filter(Boolean).join(" ")
}

export default function ApplicationStageResultsHistoryModal({
  active: isActive,
  onActiveChange,
  funnelSteps,
  stageResults,
}: Props) {
  return (
    <Modal.Root active={isActive} onActiveChange={onActiveChange} width={760}>
      <Modal.Header>Результаты найма кандидата</Modal.Header>

      <RemoteData
        data={stageResults}
        onSuccess={(results) => {
          const resultsByStepId = new Map(
            results
              .filter((stageResult) => stageResult.funnelStep?.id)
              .map((stageResult) => [stageResult.funnelStep!.id, stageResult]),
          )

          if (!funnelSteps?.length) {
            return <p className="text-secondary-light">Этапы найма не заданы</p>
          }

          return (
            <div className="flex max-h-[70dvh] flex-col gap-3 pr-1">
              {funnelSteps.map((funnelStep, index) => {
                const stageResult = resultsByStepId.get(funnelStep.id)

                return (
                  <div className="flex flex-col gap-2" key={funnelStep.id}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-h4">{funnelStep.name}</h3>
                    </div>

                    {stageResult ? (
                      <div className=" flex flex-col gap-2 text-sm">
                        {stageResult.summary && (
                          <div className="flex flex-col gap-0.5">
                            <p className="text-secondary-light">Итог</p>
                            <p className="whitespace-pre-wrap text-base">
                              {stageResult.summary}
                            </p>
                          </div>
                        )}

                        {stageResult.pros && (
                          <div className="flex flex-col gap-0.5">
                            <p className="text-secondary-light">Плюсы</p>
                            <p className="whitespace-pre-wrap text-base">
                              {stageResult.pros}
                            </p>
                          </div>
                        )}

                        {stageResult.cons && (
                          <div className="flex flex-col gap-0.5">
                            <p className="text-secondary-light">Минусы</p>
                            <p className="whitespace-pre-wrap text-base">
                              {stageResult.cons}
                            </p>
                          </div>
                        )}

                        {stageResult.notes && (
                          <div className="flex flex-col gap-0.5">
                            <p className="text-secondary-light">Заметки</p>
                            <p className="whitespace-pre-wrap text-base">
                              {stageResult.notes}
                            </p>
                          </div>
                        )}

                        {stageResult.recommendation && (
                          <div className="flex flex-col gap-0.5">
                            <p className="text-secondary-light">Рекомендация</p>
                            <p className="text-base">
                              {
                                ApplicationStageRecommendationLabels[
                                  stageResult.recommendation
                                ]
                              }
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between gap-1 ml-auto text-secondary-light">
                          {getRecruiterName(stageResult) && (
                            <p>
                              Заполнял {getRecruiterName(stageResult)},{" "}
                              {dayjs(stageResult.updatedAt).format(
                                "D MMMM YYYY HH:mm",
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-secondary-light">
                        Не заполнено
                      </p>
                    )}

                    {index < funnelSteps.length - 1 && (
                      <span className="block mt-1 h-px bg-border" />
                    )}
                  </div>
                )
              })}
            </div>
          )
        }}
      />
    </Modal.Root>
  )
}
