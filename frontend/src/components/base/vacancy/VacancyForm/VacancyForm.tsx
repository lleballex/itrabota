"use client"

import { FormProvider, useForm } from "react-hook-form"

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

interface Props {
  vacancy?: Vacancy
}

export default function VacancyForm({ vacancy }: Props) {
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
  }, [form.formState.errors])

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
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

        <step.Component />

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
            <Button type="glass" htmlType="submit">
              {vacancy ? "Сохранить" : "Создать"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
