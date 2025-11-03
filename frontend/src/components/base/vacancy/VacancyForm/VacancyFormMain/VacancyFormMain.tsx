import { Controller, useFormContext } from "react-hook-form"

import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import {
  VacancyEmploymentTypes,
  VacancyFormats,
  VacancySchedules,
  VacancyWorkExperiences,
} from "@/types/entities/vacancy"

import Textarea from "@/components/ui/Textarea"
import Separator from "@/components/ui/Separator"
import { useSpecializations } from "@/api/specializations/get-specializations"
import { useCities } from "@/api/cities/get-cities"

import { FormInputValues, FormOutputValues } from "../form"

export default function VacancyFormMain() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  const specializations = useSpecializations()
  const cities = useCities()

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <h3 className="text-h3">Основное</h3>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Название*"
            />
          )}
        />
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="specializationId"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Направление*"
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
            name="employmentType"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Тип занятости*"
                items={Object.entries(VacancyEmploymentTypes).map(
                  ([type, title]) => ({
                    value: type,
                    content: title,
                  })
                )}
              />
            )}
          />
        </div>
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="format"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Формат работы*"
                items={Object.entries(VacancyFormats).map(([type, title]) => ({
                  value: type,
                  content: title,
                }))}
              />
            )}
          />
          <Controller
            control={form.control}
            name="schedule"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className="w-full"
                error={fieldState.error}
                label="График работы*"
                items={Object.entries(VacancySchedules).map(
                  ([type, title]) => ({
                    value: type,
                    content: title,
                  })
                )}
              />
            )}
          />
        </div>
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="workExperience"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Опыт работы*"
                items={Object.entries(VacancyWorkExperiences).map(
                  ([type, title]) => ({
                    value: type,
                    content: title,
                  })
                )}
              />
            )}
          />
          <Controller
            control={form.control}
            name="cityId"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Город"
                items={
                  cities.status === "success"
                    ? cities.data.map((city) => ({
                        value: city.id,
                        content: city.name,
                      }))
                    : []
                }
              />
            )}
          />
        </div>
      </div>

      <Separator type="horizontal" />

      <div className="flex flex-col gap-2.5">
        <h3 className="text-h3">Зарплата</h3>
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="salaryFrom"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                className="w-full"
                value={field.value?.toString()}
                error={fieldState.error}
                label="От"
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
                label="До"
              />
            )}
          />
        </div>
      </div>

      <Separator type="horizontal" />

      <div className="flex flex-col gap-2.5">
        <h3 className="text-h3">Описание</h3>
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Описание"
            />
          )}
        />
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="requirements"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Требования к кандидату"
              />
            )}
          />
          <Controller
            control={form.control}
            name="niceToHave"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Будет плюсом для кандидата"
              />
            )}
          />
        </div>
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="responsibilities"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Обязанности кандидата"
              />
            )}
          />
          <Controller
            control={form.control}
            name="conditions"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                className="w-full"
                error={fieldState.error}
                label="Условия работы"
              />
            )}
          />
        </div>
      </div>
    </>
  )
}
