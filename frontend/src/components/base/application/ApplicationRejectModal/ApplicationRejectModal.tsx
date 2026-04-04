import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import { Application } from "@/types/entities/application"
import { Controller, useForm } from "react-hook-form"
import { useRejectApplication } from "@/api/applications/reject-application"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { useToastsStore } from "@/stores/toasts"
import { UserRole } from "@/types/entities/user"
import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"
import Textarea from "@/components/ui/Textarea"

interface Props {
  application: Application
  role: UserRole
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function ApplicationRejectModal({
  application,
  role,
  active: isActive,
  onActiveChange: onIsActiveChange,
}: Props) {
  const { addToast } = useToastsStore()

  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

  const { mutate: rejectApplication, status: rejectApplicationStatus } =
    useRejectApplication()

  const onSubmit = form.handleSubmit((data) => {
    rejectApplication(
      {
        applicationId: application.id,
        ...data,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message:
              role === UserRole.Recruiter
                ? "Соискатель отклонен"
                : "Процесс найма завершен",
          })
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
        <Modal.Header>
          {role === UserRole.Recruiter
            ? "Отклонить соискателя"
            : "Завершить процесс найма"}
        </Modal.Header>
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              error={fieldState.error}
              label="Причина отклонения*"
            />
          )}
        />
        <Modal.Controls>
          <Button
            type="primary"
            htmlType="submit"
            pending={rejectApplicationStatus === "pending"}
          >
            Отклонить
          </Button>
          <Button type="secondary" onClick={() => onIsActiveChange(false)}>
            Отменить
          </Button>
        </Modal.Controls>
      </form>
    </Modal.Root>
  )
}
