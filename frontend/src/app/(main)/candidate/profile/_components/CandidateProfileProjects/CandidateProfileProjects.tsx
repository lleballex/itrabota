import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { useSkills } from "@/api/skills/get-skills"
import ProfileForm from "@/components/base/profile/ProfileForm"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import Input from "@/components/ui/Input"
import SearchSelect from "@/components/ui/SearchSelect"
import Separator from "@/components/ui/Separator"
import Textarea from "@/components/ui/Textarea"

import {
  formDefaultProjectItem,
  FormInputValues,
  FormOutputValues,
} from "../../form"

export default function CandidateProfileProjects() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()
  const skills = useSkills()

  const {
    fields: projectItems,
    append: addProjectItem,
    remove: removeProjectItem,
  } = useFieldArray({ control: form.control, name: "projects" })

  return (
    <ProfileForm.Block title="Проекты">
      {projectItems.map((item, itemIdx) => (
        <section className="flex flex-col gap-2" key={item.id}>
          <div className="flex gap-2">
            <Controller
              control={form.control}
              name={`projects.${itemIdx}.title`}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  className="w-full"
                  error={fieldState.error}
                  label="Название проекта*"
                />
              )}
            />
            <Controller
              control={form.control}
              name={`projects.${itemIdx}.url`}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="w-full"
                  error={fieldState.error}
                  label="Ссылка"
                />
              )}
            />
            <Button type="base" onClick={() => removeProjectItem(itemIdx)}>
              <Icon className="text-danger" icon="trash" />
            </Button>
          </div>
          <Controller
            control={form.control}
            name={`projects.${itemIdx}.skillIds`}
            render={({ field, fieldState }) => (
              <SearchSelect
                {...field}
                multiple
                className="w-full"
                error={fieldState.error}
                label="Навыки"
                items={
                  skills.status === "success"
                    ? skills.data.map((skill) => ({
                        value: skill.id,
                        content: skill.name,
                        searchValue: skill.name,
                      }))
                    : []
                }
              />
            )}
          />
          <Controller
            control={form.control}
            name={`projects.${itemIdx}.description`}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value ?? ""}
                className="w-full"
                error={fieldState.error}
                label="Описание (функцонал, технологии, интересные решения)"
              />
            )}
          />
          <Separator type="horizontal" className="self-center max-w-10" />
        </section>
      ))}

      <Button
        className="self-center"
        type="secondary"
        onClick={() => addProjectItem(formDefaultProjectItem)}
      >
        <Icon icon="plus" />
        Добавить проект
      </Button>
    </ProfileForm.Block>
  )
}
