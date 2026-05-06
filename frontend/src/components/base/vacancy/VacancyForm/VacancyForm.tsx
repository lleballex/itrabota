"use client"

import { FormProvider, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Vacancy } from "@/types/entities/vacancy"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"

import {
  FormInputValues,
  FormOutputValues,
  formResolver,
  getFormDefaultValues,
} from "./form"
import { getFormStepByField, useFormSteps } from "./form-steps"
import { useEffect } from "react"
import { useCreateVacancy } from "@/api/vacancies/create-vacancy"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { useToastsStore } from "@/stores/toasts"
import { Routes } from "@/config/routes"
import { useUpdateVacancy } from "@/api/vacancies/update-vacancy"

interface Props {
  vacancy?: Vacancy
  hasApplications?: boolean
}

export default function VacancyForm({ vacancy, hasApplications }: Props) {
  const router = useRouter()

  const { addToast } = useToastsStore()

  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: getFormDefaultValues(vacancy),
  })

  const {
    step,
    stepIdx,
    prevStep,
    nextStep,
    goToNextStep,
    goToPrevStep,
    goToStep,
  } = useFormSteps()

  useEffect(() => {
    const errorKey = Object.keys(form.formState.errors)[0] as string | undefined

    if (!errorKey) return

    const errorStep = getFormStepByField(errorKey)

    if (errorStep && errorStep.stepIdx !== stepIdx) {
      goToStep(errorStep.stepIdx)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.errors])

  const { mutate: create, status: createStatus } = useCreateVacancy()
  const { mutate: update, status: updateStatus } = useUpdateVacancy()
  const isFunnelEditingDisabled = Boolean(vacancy && hasApplications)

  const onSubmit = form.handleSubmit((data) => {
    if (vacancy) {
      const dataToUpdate: Partial<FormOutputValues> = { ...data }

      if (isFunnelEditingDisabled) {
        delete dataToUpdate.funnelSteps
      }

      update(
        {
          id: vacancy.id,
          ...dataToUpdate,
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Вакансия изменена",
            })
            router.push(Routes.recruiter.vacancy(vacancy.id))
          },
          onError: (error) => handleFormApiError({ error, form }),
        }
      )
    } else {
      create(data, {
        onSuccess: (createdVacancy) => {
          addToast({
            type: "success",
            message: "Вакансия создана",
          })
          router.push(Routes.recruiter.vacancy(createdVacancy.id))
        },
        onError: (error) => handleFormApiError({ error, form }),
      })
    }
  })

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-6 mx-auto max-w-[800px] w-full h-full"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">
            {vacancy ? "Изменение вакансии" : "Создание вакансии"}
          </h1>
          <p className="text-lg">{step.label}</p>
        </div>

        <step.Component
          isFunnelEditingDisabled={isFunnelEditingDisabled}
        />

        <div className="flex items-center self-center gap-2 mt-auto sticky bottom-[var(--spacing-screen)]">
          {prevStep && (
            <Button type="glass" onClick={goToPrevStep}>
              <Icon icon="chevronLeft" />
              Назад
            </Button>
          )}
          {nextStep && (
            <Button type="glass" onClick={goToNextStep}>
              Дальше
              <Icon icon="chevronRight" />
            </Button>
          )}
          {!nextStep && (
            <Button
              type="glass"
              htmlType="submit"
              pending={createStatus === "pending" || updateStatus === "pending"}
            >
              {vacancy ? "Сохранить" : "Создать"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
