import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"

import {
  formDefaultWorkExperienceItem,
  FormInputValues,
  FormOutputValues,
} from "../../form"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import Separator from "@/components/ui/Separator"
import Checkbox from "@/components/ui/Checkbox"

export default function CandidateProfileWorkExperience() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  const {
    fields: workExperienceItems,
    append: addWorkExperienceItem,
    remove: removeWorkExperienceItem,
  } = useFieldArray({ control: form.control, name: "workExperience" })

  return (
    <ProfileForm.Block title="Опыт работы">
      {workExperienceItems.map((item, itemIdx) => (
        <section className="flex flex-col gap-2" key={item.id}>
          <div className="flex gap-2">
            <Controller
              control={form.control}
              name={`workExperience.${itemIdx}.position`}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  className="w-full"
                  error={fieldState.error}
                  label="Должность*"
                />
              )}
            />
            <Controller
              control={form.control}
              name={`workExperience.${itemIdx}.companyName`}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  className="w-full"
                  error={fieldState.error}
                  label="Организация*"
                />
              )}
            />
            <Button
              type="base"
              onClick={() => removeWorkExperienceItem(itemIdx)}
            >
              <Icon className="text-danger" icon="trash" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Controller
              control={form.control}
              name={`workExperience.${itemIdx}.startedAt`}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  className="w-full"
                  error={fieldState.error}
                  label="Дата начала*"
                />
              )}
            />
            <Controller
              control={form.control}
              name={`workExperience.${itemIdx}.endedAt`}
              render={({ field, fieldState }) => (
                <div className="flex gap-2 items-center w-full">
                  <Input
                    className="w-full"
                    {...field}
                    error={fieldState.error}
                    label="Дата конца"
                  />
                  <Checkbox
                    value={field.value === null}
                    onChange={(val) => field.onChange(val ? null : undefined)}
                    className="shrink-0"
                  >
                    По настоящее время
                  </Checkbox>
                </div>
              )}
            />
          </div>
          <Controller
            control={form.control}
            name={`workExperience.${itemIdx}.description`}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Описание"
              />
            )}
          />
          {/* // TODO: move outside the section */}
          <Separator type="horizontal" className="self-center max-w-10" />
        </section>
      ))}

      <Button
        className="self-center"
        type="secondary"
        onClick={() => addWorkExperienceItem(formDefaultWorkExperienceItem)}
      >
        <Icon icon="plus" />
        Добавить опыт работы
      </Button>
    </ProfileForm.Block>
  )
}
