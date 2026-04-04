import { Controller, useFormContext, useWatch } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"
import Checkbox from "@/components/ui/Checkbox"

import { FormInputValues, FormOutputValues } from "../../form"
import MountTransition from "@/components/ui/MountTransition"

export default function CandidateProfileVisibility() {
  const form = useFormContext<FormInputValues, unknown, FormOutputValues>()

  const formIsHidden = useWatch({ control: form.control, name: "isHidden" })

  return (
    <ProfileForm.Block title="Видимость резюме">
      <Controller
        control={form.control}
        name="isHidden"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <Checkbox
              className="self-start"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
            >
              Скрыть резюме от рекрутеров
            </Checkbox>
            <p className="text-sm text-secondary-light">
              <MountTransition>
                {formIsHidden &&
                  "Ваше резюме не будет предлагаться рекрутерам, и вы не сможете получать приглашения по вакансиям. Но вы все еще можете сами откликаться на любые вакансии"}
              </MountTransition>
              <MountTransition>
                {!formIsHidden &&
                  "Ваше резюме видно рекрутерам, и вы можете получать приглашения по вакансиям"}
              </MountTransition>
            </p>
          </div>
        )}
      />
    </ProfileForm.Block>
  )
}
