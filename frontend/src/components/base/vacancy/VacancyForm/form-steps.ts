import { useState } from "react"

import VacancyFormMain, { vacancyFormMainFields } from "./VacancyFormMain"
import VacancyFormFunnel, { vacancyFormFunnelFields } from "./VacancyFormFunnel"

const formSteps = [
  {
    label: "Информации о вакансии",
    fields: vacancyFormMainFields,
    Component: VacancyFormMain,
  },
  {
    label: "Воронка найма",
    fields: vacancyFormFunnelFields,
    Component: VacancyFormFunnel,
  },
]

export const useFormSteps = () => {
  const [activeStepIdx, setActiveStepIdx] = useState(0)

  return {
    step: formSteps[activeStepIdx],
    stepIdx: activeStepIdx,
    prevStep: formSteps[activeStepIdx - 1] as (typeof formSteps)[0] | undefined,
    nextStep: formSteps[activeStepIdx + 1] as (typeof formSteps)[0] | undefined,
    goToNextStep: () => setActiveStepIdx(activeStepIdx + 1),
    goToPrevStep: () => setActiveStepIdx(activeStepIdx - 1),
    goToStep: (idx: number) => setActiveStepIdx(idx),
  }
}

export const getFormStepByField = (key: string) => {
  for (const step of formSteps) {
    if (step.fields.includes(key as any)) {
      return {
        step,
        stepIdx: formSteps.indexOf(step),
      }
    }
  }

  return null
}
