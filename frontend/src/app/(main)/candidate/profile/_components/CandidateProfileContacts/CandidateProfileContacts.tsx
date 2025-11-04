import { Controller, useFormContext } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"
import Input from "@/components/ui/Input"

import { FormInputValues, FormOutputValues } from "../../form"

export default function CandidateProfileContacts() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  return (
    <ProfileForm.Block title="Контакты">
      <ProfileForm.FieldsRow>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Email*"
            />
          )}
        />
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Телефон"
            />
          )}
        />
        <Controller
          control={form.control}
          name="tgUsername"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="w-full"
              error={fieldState.error}
              label="Telegram"
            />
          )}
        />
      </ProfileForm.FieldsRow>
    </ProfileForm.Block>
  )
}
