import { Controller, useFormContext } from "react-hook-form"

import AvatarInput from "@/components/ui/AvatarInput"

import { FormValues } from "../../form"

export default function RecruiterProfileAvatar() {
  const form = useFormContext<FormValues>()

  return (
    <Controller
      control={form.control}
      name="company.logo"
      render={({ field, fieldState }) => (
        <AvatarInput {...field} className="shrink-0" error={fieldState.error} />
      )}
    />
  )
}
