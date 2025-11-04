import { Controller, useFormContext } from "react-hook-form"

import AvatarInput from "@/components/ui/AvatarInput"

import { FormInputValues, FormOutputValues } from "../../form"

export default function CandidateProfileAvatar() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  return (
    <Controller
      control={form.control}
      name="avatar"
      render={({ field, fieldState }) => (
        <AvatarInput {...field} className="shrink-0" error={fieldState.error} />
      )}
    />
  )
}
