import { Controller, useFormContext } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"
import Input from "@/components/ui/Input"
import { useCities } from "@/api/cities/get-cities"
import Select from "@/components/ui/Select"

import { FormInputValues, FormOutputValues } from "../../form"

export default function CandidateProfileMain() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  const cities = useCities()

  return (
    <ProfileForm.Block title="Основная информация">
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Фамилия*"
            />
          )}
        />
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Имя*"
            />
          )}
        />
        <Controller
          control={form.control}
          name="patronymic"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Отчество"
            />
          )}
        />
      </ProfileForm.FieldsRow>
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="bornAt"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Дата рождения*"
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
              label="Город проживания"
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
      </ProfileForm.FieldsRow>
    </ProfileForm.Block>
  )
}
