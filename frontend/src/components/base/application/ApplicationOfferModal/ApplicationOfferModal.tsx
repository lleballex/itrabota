import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import { useOfferApplicationByRecruiter } from "@/api/applications/offer-application-by-recruiter"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Textarea from "@/components/ui/Textarea"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { Application } from "@/types/entities/application"
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
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function ApplicationOfferModal({
  application,
  vacancy,
  active: isActive,
  onActiveChange,
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
      message: currentFunnelStep?.approveMessage ?? undefined,
    })
  }, [currentFunnelStep, form, isActive])

  const { mutate: offerApplication, status: offerApplicationStatus } =
    useOfferApplicationByRecruiter()

  const onSubmit = form.handleSubmit((data) => {
    offerApplication(
      {
        applicationId: application.id,
        ...data,
      },
      {
        onSuccess: () => {
          form.reset()
          onActiveChange(false)
        },
        onError: (error) => handleFormApiError({ error, form }),
      },
    )
  })

  return (
    <Modal.Root active={isActive} onActiveChange={onActiveChange} width={650}>
      <form className="contents" onSubmit={onSubmit}>
        <Modal.Header>Приглашение на следующий этап</Modal.Header>

        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              error={fieldState.error}
              label="Сообщение для кандидата*"
            />
          )}
        />

        <Modal.Controls>
          <Button
            type="primary"
            htmlType="submit"
            pending={offerApplicationStatus === "pending"}
          >
            Отправить приглашение
          </Button>
          <Button type="secondary" onClick={() => onActiveChange(false)}>
            Отменить
          </Button>
        </Modal.Controls>
      </form>
    </Modal.Root>
  )
}
