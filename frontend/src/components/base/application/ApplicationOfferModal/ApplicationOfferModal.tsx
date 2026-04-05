import { Controller, useForm } from "react-hook-form"

import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Textarea from "@/components/ui/Textarea"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { Application } from "@/types/entities/application"

import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"
import { useOfferApplicationByRecruiter } from "@/api/applications/offer-application-by-recruiter"

interface Props {
  application: Application
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function ApplicationOfferModal({
  application,
  active: isActive,
  onActiveChange,
}: Props) {
  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

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
        <Modal.Header>Пригласить на следующий этап</Modal.Header>

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
