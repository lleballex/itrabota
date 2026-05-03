import { Controller, useFormContext } from "react-hook-form"

import { useSkills } from "@/api/skills/get-skills"
import { useSpecializations } from "@/api/specializations/get-specializations"
import ProfileForm from "@/components/base/profile/ProfileForm"
import Select from "@/components/ui/Select"

import { FormInputValues, FormOutputValues } from "../../form"
import Textarea from "@/components/ui/Textarea"

export default function CandidateProfileJob() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()
  const specializations = useSpecializations()
  const skills = useSkills()

  return (
    <ProfileForm.Block title="Профессиональная информация">
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="specializationId"
          render={({ field, fieldState }) => (
            <Select
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Направление"
              items={
                specializations.status === "success"
                  ? specializations.data.map((specialization) => ({
                      value: specialization.id,
                      content: specialization.name,
                    }))
                  : []
              }
            />
          )}
        />
        <Controller
          control={form.control}
          name="skillIds"
          render={({ field, fieldState }) => (
            <Select
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
                    }))
                  : []
              }
            />
          )}
        />
      </ProfileForm.FieldsRow>
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            className="w-full"
            error={fieldState.error}
            label="О себе"
          />
        )}
      />
    </ProfileForm.Block>
  )
}
