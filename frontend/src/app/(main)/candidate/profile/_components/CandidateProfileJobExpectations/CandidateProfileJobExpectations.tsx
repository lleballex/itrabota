import { Controller, useFormContext } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import {
  VacancyEmploymentTypes,
  VacancyFormats,
  VacancySchedules,
} from "@/types/entities/vacancy"

import { FormInputValues, FormOutputValues } from "../../form"

export default function CandidateProfileJobExpectations() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  return (
    <ProfileForm.Block title="Ожидания от работы">
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="employmentType"
          render={({ field, fieldState }) => (
            <Select
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Тип занятости"
              items={Object.entries(VacancyEmploymentTypes).map(
                ([type, title]) => ({
                  value: type,
                  content: title,
                }),
              )}
            />
          )}
        />
        <Controller
          control={form.control}
          name="format"
          render={({ field, fieldState }) => (
            <Select
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Формат работы"
              items={Object.entries(VacancyFormats).map(([type, title]) => ({
                value: type,
                content: title,
              }))}
            />
          )}
        />
      </ProfileForm.FieldsRow>
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="schedule"
          render={({ field, fieldState }) => (
            <Select
              {...field}
              className="w-full"
              error={fieldState.error}
              label="График работы"
              items={Object.entries(VacancySchedules).map(([type, title]) => ({
                value: type,
                content: title,
              }))}
            />
          )}
        />
      </ProfileForm.FieldsRow>
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="salaryFrom"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              value={field.value?.toString()}
              error={fieldState.error}
              label="Зарплата от"
            />
          )}
        />
        <Controller
          control={form.control}
          name="salaryTo"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              value={field.value?.toString()}
              error={fieldState.error}
              label="Зарплата до"
            />
          )}
        />
      </ProfileForm.FieldsRow>
    </ProfileForm.Block>
  )
}
