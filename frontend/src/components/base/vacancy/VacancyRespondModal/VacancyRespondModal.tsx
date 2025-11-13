import { Controller, useForm } from "react-hook-form"

import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Textarea from "@/components/ui/Textarea"
import { useCreateApplication } from "@/api/applications/create-application"
import { Vacancy } from "@/types/entities/vacancy"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { useToastsStore } from "@/stores/toasts"

import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"

interface Props {
  vacancy: Vacancy
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function VacancyRespondModal({
  vacancy,
  active,
  onActiveChange: onIsActiveChange,
}: Props) {
  const { addToast } = useToastsStore()

  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

  const { mutate: createApplication, status: createApplicationStatus } =
    useCreateApplication()

  const onSubmit = form.handleSubmit((data) => {
    createApplication(
      {
        vacancyId: vacancy.id,
        ...data,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Отклик отправлен",
          })
          onIsActiveChange(false)
          form.reset()
        },
        onError: (error) => handleFormApiError({ error, form }),
      }
    )
  })

  return (
    <Modal.Root width={600} active={active} onActiveChange={onIsActiveChange}>
      <form className="contents" onSubmit={onSubmit}>
        <Modal.Header>Откликнуться на вакансию</Modal.Header>
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              error={fieldState.error}
              label="Немножко о себе"
            />
          )}
        />
        <Modal.Controls>
          <Button
            type="primary"
            htmlType="submit"
            pending={createApplicationStatus === "pending"}
          >
            Откликнуться
          </Button>
          <Button type="secondary" onClick={() => onIsActiveChange(false)}>
            Отменить
          </Button>
        </Modal.Controls>
      </form>
    </Modal.Root>
  )
}
