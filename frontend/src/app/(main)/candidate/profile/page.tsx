"use client"

import { useForm } from "react-hook-form"

import ProfileForm from "@/components/base/profile/ProfileForm"
import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"
import { useCreateMeCandidate } from "@/api/me/create-me-candidate"
import { handleFormApiError } from "@/lib/handle-form-api-error"
import { useToastsStore } from "@/stores/toasts"
import { useUpdateMeCandidate } from "@/api/me/update-me-candidate"

import {
  FormInputValues,
  FormOutputValues,
  formResolver,
  getFormDefaultValues,
} from "./form"
import CandidateProfileMain from "./_components/CandidateProfileMain"
import CandidateProfileContacts from "./_components/CandidateProfileContacts/CandidateProfileContacts"
import CandidateProfileJob from "./_components/CandidateProfileJob"
import CandidateProfileWorkExperience from "./_components/CandidateProfileWorkExperience"
import CandidateProfileAvatar from "./_components/CandidateProfileAvatar"

interface Props {
  me: User
}

const Content = ({ me }: Props) => {
  const { addToast } = useToastsStore()

  const form = useForm<FormInputValues, unknown, FormOutputValues>({
    resolver: formResolver,
    defaultValues: getFormDefaultValues(me),
  })

  const { mutate: create, status: createStatus } = useCreateMeCandidate()
  const { mutate: update, status: updateStatus } = useUpdateMeCandidate()

  const onSubmit = form.handleSubmit((data) => {
    if (me.candidate) {
      update(
        { ...data, avatar: data.avatar as any },
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
        { ...data, avatar: data.avatar as any },
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
    <ProfileForm.Root form={form} onSubmit={onSubmit}>
      <CandidateProfileAvatar />
      <ProfileForm.Main
        pending={createStatus === "pending" || updateStatus === "pending"}
      >
        <CandidateProfileMain />
        <ProfileForm.BlockSeparator />
        <CandidateProfileContacts />
        <ProfileForm.BlockSeparator />
        <CandidateProfileJob />
        <ProfileForm.BlockSeparator />
        <CandidateProfileWorkExperience />
      </ProfileForm.Main>
    </ProfileForm.Root>
  )
}

export default function CandidateProfilePage() {
  return (
    <AuthProvider
      Component={Content}
      roles={[UserRole.Candidate]}
      allowNoProfile
    />
  )
}
