"use client"

import { FormProvider, useForm } from "react-hook-form"

import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"
import Button from "@/components/ui/Button"
import Separator from "@/components/ui/Separator"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { useToastsStore } from "@/stores/toasts"
import { useCreateMeRecruiter } from "@/api/me/create-me-recruiter"
import { useUpdateMeRecruiter } from "@/api/me/update-me-recruiter"

import { formResolver, FormValues, getFormDefaultValues } from "./form"
import RecruiterProfileMain from "./_components/RecruiterProfileMain"
import RecruiterProfileCompany from "./_components/RecruiterProfileCompany"
import RecruiterProfilePassword from "./_components/RecruiterProfilePassword"
import RecruiterProfileAvatar from "./_components/RecruiterProfileAvatar"

interface Props {
  me: User
}

const Content = ({ me }: Props) => {
  const { addToast } = useToastsStore()

  const form = useForm<FormValues>({
    resolver: formResolver,
    defaultValues: getFormDefaultValues(me),
  })

  const { mutate: create, status: createStatus } = useCreateMeRecruiter()
  const { mutate: update, status: updateStatus } = useUpdateMeRecruiter()

  const onSubmit = form.handleSubmit((data) => {
    // TODO: fix this
    const companyLogo = data.company.logo?.content
      ? (data.company.logo as any)
      : data.company.logo
      ? undefined
      : null

    if (me.recruiter) {
      update(
        {
          ...data,
          company: {
            ...data.company,
            logo: companyLogo,
          },
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Данные сохранены",
            })
          },
          onError: (error) => handleFormApiError({ error, form }),
        }
      )
    } else {
      create(
        {
          ...data,
          company: {
            ...data.company,
            logo: companyLogo,
          },
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Данные сохранены",
            })
          },
          onError: (error) => handleFormApiError({ error, form }),
        }
      )
    }
  })

  return (
    <FormProvider {...form}>
      <form className="flex gap-5 relative h-full" onSubmit={onSubmit}>
        <RecruiterProfileAvatar />
        <div className="flex flex-col gap-5">
          <RecruiterProfileMain />
          <Separator type="horizontal" />
          <RecruiterProfileCompany />
          <Separator type="horizontal" />
          <RecruiterProfilePassword me={me} />
          <Button
            className="self-center mt-auto sticky bottom-3"
            type="glass"
            htmlType="submit"
            pending={createStatus === "pending" || updateStatus === "pending"}
          >
            Сохранить данные
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default function RecruiterProfilePage() {
  return (
    <AuthProvider
      Component={Content}
      roles={[UserRole.Recruiter]}
      allowNoProfile
    />
  )
}
