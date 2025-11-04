import { Controller, useFormContext } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"

import { FormInputValues, FormOutputValues } from "../../form"
import Textarea from "@/components/ui/Textarea"

export default function CandidateProfileJob() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  return (
    <ProfileForm.Block title="Профессиональная информация">
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
