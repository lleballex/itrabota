import { Controller, useFormContext } from "react-hook-form"

import Input from "@/components/ui/Input"

import { FormValues } from "../../form"

export default function RecruiterProfileCompany() {
  const form = useFormContext<FormValues>()

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-h3">О компании</h2>
      <div className="flex gap-2">
        <Controller
          control={form.control}
          name="company.name"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Название*"
            />
          )}
        />
        <Controller
          control={form.control}
          name="company.url"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Сайт"
            />
          )}
        />
      </div>
    </section>
  )
}
