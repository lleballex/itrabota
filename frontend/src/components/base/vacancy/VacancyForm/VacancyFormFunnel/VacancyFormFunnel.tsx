import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import Separator from "@/components/ui/Separator"
import Checkbox from "@/components/ui/Checkbox"

import {
  formDefaultFunnelStep,
  FormInputValues,
  FormOutputValues,
} from "../form"

export default function VacancyFormFunnel() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  const {
    fields: formFunnelSteps,
    append: addFormFunnelStep_,
    remove: removeFormFunnelStep,
    move: moveFormFunnelStep,
  } = useFieldArray({
    control: form.control,
    name: "funnel",
  })

  const addFormFunnelStep = () => {
    addFormFunnelStep_(formDefaultFunnelStep as FormOutputValues["funnel"][0])
  }

  const moveFormFunnelStepForward = (stepIdx: number) => {
    if (stepIdx < formFunnelSteps.length - 1) {
      moveFormFunnelStep(stepIdx, stepIdx + 1)
    }
  }

  const moveFormFunnelStepBackward = (stepIdx: number) => {
    if (stepIdx > 0) {
      moveFormFunnelStep(stepIdx, stepIdx - 1)
    }
  }

  return (
    <>
      {formFunnelSteps.map((step, stepIdx) => (
        <>
          <div className="flex flex-col gap-2.5" key={step.id}>
            <div className="flex items-center gap-2">
              <Button
                type="base"
                onClick={() => moveFormFunnelStepBackward(stepIdx)}
              >
                <Icon icon="chevronUp" />
              </Button>
              <Button
                type="base"
                onClick={() => moveFormFunnelStepForward(stepIdx)}
              >
                <Icon icon="chevronDown" />
              </Button>
              <Controller
                control={form.control}
                name={`funnel.${stepIdx}.name`}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    className="w-full"
                    error={fieldState.error}
                    label="Название этапа*"
                  />
                )}
              />
              <Button type="base" onClick={() => removeFormFunnelStep(stepIdx)}>
                <Icon className="text-danger" icon="trash" />
              </Button>
            </div>

            <Controller
              control={form.control}
              name={`funnel.${stepIdx}.shouldCreateCall`}
              render={({ field, fieldState }) => (
                <Checkbox
                  {...field}
                  className="self-start"
                  error={fieldState.error}
                >
                  Автоматически назначать видеовстречу для этого этапа
                </Checkbox>
              )}
            />

            <Controller
              control={form.control}
              name={`funnel.${stepIdx}.approveMessage`}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  className="w-full"
                  error={fieldState.error}
                  label="Шаблон приглашения на следующий этап"
                />
              )}
            />

            <Controller
              control={form.control}
              name={`funnel.${stepIdx}.rejectMessage`}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  className="w-full"
                  error={fieldState.error}
                  label="Шаблон отказа"
                />
              )}
            />
          </div>

          {stepIdx < formFunnelSteps.length - 1 && (
            <Separator type="horizontal" />
          )}
        </>
      ))}

      <Button
        className="self-center"
        type="secondary"
        onClick={addFormFunnelStep}
      >
        <Icon icon="plus" />
        Добавить этап
      </Button>
    </>
  )
}
