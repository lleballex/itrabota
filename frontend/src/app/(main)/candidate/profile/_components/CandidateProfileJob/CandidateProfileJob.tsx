import { Controller, useFormContext } from "react-hook-form"

import { useSkills } from "@/api/skills/get-skills"
import { useSpecializations } from "@/api/specializations/get-specializations"
import ProfileForm from "@/components/base/profile/ProfileForm"
import Input from "@/components/ui/Input"
import SearchSelect from "@/components/ui/SearchSelect"

import { FormInputValues, FormOutputValues } from "../../form"
import Textarea from "@/components/ui/Textarea"

export default function CandidateProfileJob() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()
  const specializations = useSpecializations()
  const skills = useSkills()

  return (
    <ProfileForm.Block title="Профессиональная информация">
      <Controller
        control={form.control}
        name="education"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ""}
            className="w-full"
            error={fieldState.error}
            label="Образование"
          />
        )}
      />
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="specializationId"
          render={({ field, fieldState }) => (
            <SearchSelect
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Направление"
              items={
                specializations.status === "success"
                  ? specializations.data.map((specialization) => ({
                      value: specialization.id,
                      content: specialization.name,
                      searchValue: specialization.name,
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
      </ProfileForm.FieldsRow>
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="githubUrl"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              className="w-full"
              error={fieldState.error}
              label="GitHub"
            />
          )}
        />
        <Controller
          control={form.control}
          name="gitlabUrl"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              className="w-full"
              error={fieldState.error}
              label="GitLab"
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
            value={field.value ?? ""}
            className="w-full"
            error={fieldState.error}
            label="О себе"
          />
        )}
      />
    </ProfileForm.Block>
  )
}
