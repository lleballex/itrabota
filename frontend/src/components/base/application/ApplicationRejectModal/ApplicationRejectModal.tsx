import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import { useRejectApplication } from "@/api/applications/reject-application"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Textarea from "@/components/ui/Textarea"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { Application } from "@/types/entities/application"
import { UserRole } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"

import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"

interface Props {
  application: Application
  vacancy?: Vacancy
  role: UserRole
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function ApplicationRejectModal({
  application,
  vacancy,
  role,
  active: isActive,
  onActiveChange: onIsActiveChange,
}: Props) {
  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

  const currentFunnelStep = useMemo(() => {
    if (!application.funnelStep) return null

    return (
      vacancy?.funnelSteps?.find((step) => step.id === application.funnelStep?.id) ??
      application.funnelStep
    )
  }, [application.funnelStep, vacancy?.funnelSteps])

  useEffect(() => {
    if (!isActive) return

    form.reset({
      message:
        role === UserRole.Recruiter
          ? currentFunnelStep?.rejectMessage ?? undefined
          : undefined,
    })
  }, [currentFunnelStep, form, isActive, role])

  const { mutate: rejectApplication, status: rejectApplicationStatus } =
    useRejectApplication()

  const onSubmit = form.handleSubmit((data) => {
    rejectApplication(
      {
        applicationId: application.id,
        role,
        ...data,
      },
      {
        onSuccess: () => {
          form.reset()
          onIsActiveChange(false)
        },
        onError: (error) => handleFormApiError({ error, form }),
      },
    )
  })

  return (
    <Modal.Root active={isActive} onActiveChange={onIsActiveChange} width={650}>
      <form className="contents" onSubmit={onSubmit}>
        <Modal.Header>Завершение процесса найма</Modal.Header>
        <p>
          {role === UserRole.Recruiter
            ? "Вы собираетесь завершить процесс найма и отказать кандидату. Он больше не сможет откликаться на данную вакансию"
            : "Вы собираетесь завершить процесс найма, не дойдя до конца. У вас больше не будет возможности откликнуться на данную вакансию"}
        </p>
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              error={fieldState.error}
              label="Причина завершения*"
            />
          )}
        />
        <Modal.Controls>
          <Button
            type="primary"
            htmlType="submit"
            pending={rejectApplicationStatus === "pending"}
          >
            Завершить
          </Button>
          <Button type="secondary" onClick={() => onIsActiveChange(false)}>
            Отменить
          </Button>
        </Modal.Controls>
      </form>
    </Modal.Root>
  )
}
