"use client"

import { FormProvider, useForm } from "react-hook-form"

import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"
import Button from "@/components/ui/Button"
import Separator from "@/components/ui/Separator"

import { formResolver, FormValues, getFormDefaultValues } from "./form"
import RecruiterProfileMain from "./_components/RecruiterProfileMain"
import RecruiterProfileCompany from "./_components/RecruiterProfileCompany"
import RecruiterProfilePassword from "./_components/RecruiterProfilePassword"
import RecruiterProfileAvatar from "./_components/RecruiterProfileAvatar"

interface Props {
  me: User
}

const Content = ({ me }: Props) => {
  const form = useForm<FormValues>({
    resolver: formResolver,
    defaultValues: getFormDefaultValues(me),
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <FormProvider {...form}>
      <form className="flex gap-5 relative h-full" onSubmit={onSubmit}>
        <RecruiterProfileAvatar />
        <div className="flex flex-col gap-4">
          <RecruiterProfileMain />
          <Separator type="horizontal" />
          <RecruiterProfileCompany />
          <Separator type="horizontal" />
          <RecruiterProfilePassword me={me} />
          <Button
            className="self-center mt-auto sticky bottom-3"
            type="glass"
            htmlType="submit"
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
