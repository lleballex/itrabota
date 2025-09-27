import { Controller, useFormContext } from "react-hook-form"

import Input from "@/components/ui/Input"

import { FormValues } from "../../form"

export default function RecruiterProfileMain() {
  const form = useFormContext<FormValues>()

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-h3">Основная информация</h2>
      <div className="flex gap-2">
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
      </div>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            className="w-[calc((100%-var(--spacing)*2)/3)]"
            error={fieldState.error}
            label="Email*"
          />
        )}
      />
    </section>
  )
}
