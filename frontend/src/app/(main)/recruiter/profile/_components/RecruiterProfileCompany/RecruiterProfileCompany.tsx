import { Controller, useFormContext } from "react-hook-form"

import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { useIndustries } from "@/api/industries/get-industries"

import { FormValues } from "../../form"

export default function RecruiterProfileCompany() {
  const form = useFormContext<FormValues>()

  const industries = useIndustries()

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
      <Controller
        control={form.control}
        name="company.industry.id"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            className="w-[calc((100%-var(--spacing))/2)]"
            label="Сфера деятельности*"
            error={fieldState.error}
            items={
              industries.status === "success"
                ? industries.data.map((industry) => ({
                    value: industry.id,
                    content: industry.name,
                  }))
                : []
            }
          />
        )}
      />
    </section>
  )
}
