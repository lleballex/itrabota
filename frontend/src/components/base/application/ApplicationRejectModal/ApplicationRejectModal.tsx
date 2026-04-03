import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import { Application } from "@/types/entities/application"
import { Controller, useForm } from "react-hook-form"
import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"
import Textarea from "@/components/ui/Textarea"

interface Props {
  application: Application
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function ApplicationRejectModal({
  application,
  active: isActive,
  onActiveChange: onIsActiveChange,
}: Props) {
  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

  const onSubmit = form.handleSubmit((data) => {})

  return (
    <Modal.Root active={isActive} onActiveChange={onIsActiveChange} width={650}>
      <form className="contents" onSubmit={onSubmit}>
        <Modal.Header>Отклонить соискателя</Modal.Header>
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
            // pending={createApplicationStatus === "pending"}
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
