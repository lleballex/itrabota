"use client"

import { Controller, useForm } from "react-hook-form"

import { useCreateApplication } from "@/api/applications/create-application"
import { useVacancies } from "@/api/vacancies/get-vacancies"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import RemoteData from "@/components/ui/RemoteData"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { useToastsStore } from "@/stores/toasts"
import { Candidate } from "@/types/entities/candidate"
import { UserRole } from "@/types/entities/user"
import { VacancyStatus } from "@/types/entities/vacancy"

import {
  formDefaultValues,
  FormInputValues,
  FormOutputValues,
  formResolver,
} from "./form"

interface Props {
  candidate: Candidate
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function InviteCandidateModal({
  candidate,
  active,
  onActiveChange,
}: Props) {
  const { addToast } = useToastsStore()

  const vacancies = useVacancies({
    role: UserRole.Recruiter,
    status: VacancyStatus.Active,
  })

  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: formDefaultValues,
  })

  const { mutate: createApplication, status: createApplicationStatus } =
    useCreateApplication()

  const onSubmit = form.handleSubmit((data) => {
    createApplication(
      {
        role: UserRole.Recruiter,
        candidateId: candidate.id,
        ...data,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Приглашение отправлено",
          })
          onActiveChange(false)
          form.reset()
        },
        onError: (error) => handleFormApiError({ error, form }),
      },
    )
  })

  return (
    <Modal.Root width={600} active={active} onActiveChange={onActiveChange}>
      <form className="contents" onSubmit={onSubmit}>
        <Modal.Header>Пригласить на вакансию</Modal.Header>

        <RemoteData
          data={vacancies}
          onSuccess={(vacancies) => (
            <>
              <Controller
                control={form.control}
                name="vacancyId"
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    error={fieldState.error}
                    label="Вакансия*"
                    items={vacancies.map((vacancy) => ({
                      value: vacancy.id,
                      content: vacancy.title,
                    }))}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    error={fieldState.error}
                    label="Сообщение"
                  />
                )}
              />

              <Modal.Controls>
                <Button
                  type="primary"
                  htmlType="submit"
                  pending={createApplicationStatus === "pending"}
                >
                  Отправить приглашение
                </Button>
                <Button type="secondary" onClick={() => onActiveChange(false)}>
                  Отменить
                </Button>
              </Modal.Controls>
            </>
          )}
        />
      </form>
    </Modal.Root>
  )
}
