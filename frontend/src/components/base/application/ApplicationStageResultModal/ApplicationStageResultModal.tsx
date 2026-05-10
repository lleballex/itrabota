"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { useUpsertCurrentApplicationStageResult } from "@/api/applications/upsert-current-application-stage-result"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { Application } from "@/types/entities/application"
import {
  ApplicationStageRecommendation,
  ApplicationStageRecommendationLabels,
  ApplicationStageResult,
} from "@/types/entities/application-stage-result"

import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"

interface Props {
  application: Application
  currentStageName: string
  stageResult?: ApplicationStageResult | null
  active: boolean
  onActiveChange: (val: boolean) => void
}

const recommendationItems = Object.values(ApplicationStageRecommendation).map(
  (value) => ({
    value,
    content: ApplicationStageRecommendationLabels[value],
  }),
)

export default function ApplicationStageResultModal({
  application,
  currentStageName,
  stageResult,
  active: isActive,
  onActiveChange,
}: Props) {
  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

  useEffect(() => {
    if (!isActive) {
      return
    }

    form.reset({
      summary: stageResult?.summary ?? null,
      pros: stageResult?.pros ?? null,
      cons: stageResult?.cons ?? null,
      notes: stageResult?.notes ?? null,
      recommendation: stageResult?.recommendation ?? null,
    })
  }, [form, isActive, stageResult])

  const { mutate: upsertStageResult, status: upsertStageResultStatus } =
    useUpsertCurrentApplicationStageResult()

  const onSubmit = form.handleSubmit((data) => {
    upsertStageResult(
      {
        applicationId: application.id,
        ...data,
      },
      {
        onSuccess: () => {
          onActiveChange(false)
        },
        onError: (error) => handleFormApiError({ error, form }),
      },
    )
  })

  return (
    <Modal.Root active={isActive} onActiveChange={onActiveChange} width={700}>
      <form className="contents" onSubmit={onSubmit}>
        <Modal.Header>Результат этапа {currentStageName}</Modal.Header>

        <Controller
          control={form.control}
          name="summary"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              error={fieldState.error}
              label="Короткий итог"
            />
          )}
        />

        <Controller
          control={form.control}
          name="pros"
          render={({ field, fieldState }) => (
            <Textarea {...field} error={fieldState.error} label="Плюсы" />
          )}
        />

        <Controller
          control={form.control}
          name="cons"
          render={({ field, fieldState }) => (
            <Textarea {...field} error={fieldState.error} label="Минусы" />
          )}
        />

        <Controller
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <Textarea {...field} error={fieldState.error} label="Заметки" />
          )}
        />

        <Controller
          control={form.control}
          name="recommendation"
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Рекомендация"
              items={recommendationItems}
            />
          )}
        />

        <Modal.Controls>
          <Button
            type="primary"
            htmlType="submit"
            pending={upsertStageResultStatus === "pending"}
          >
            Сохранить
          </Button>
          <Button type="secondary" onClick={() => onActiveChange(false)}>
            Отменить
          </Button>
        </Modal.Controls>
      </form>
    </Modal.Root>
  )
}
