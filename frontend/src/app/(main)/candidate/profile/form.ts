import { DeepPartial } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { formSchemaFields } from "@/lib/form-schema-fields"
import { User } from "@/types/entities/user"

const formSchema = z.object({
  avatar: formSchemaFields.file.nullable(),
  firstName: formSchemaFields.string,
  lastName: formSchemaFields.string,
  patronymic: formSchemaFields.string.nullable(),
  bornAt: formSchemaFields.string, // TODO: date
  cityId: formSchemaFields.relation.nullable(),
  email: formSchemaFields.email,
  phoneNumber: formSchemaFields.string.nullable(), // TODO: maybe phone
  tgUsername: formSchemaFields.string.nullable(),
  // skillIds: formSchemaFields.
  description: formSchemaFields.string.nullable(),
  workExperience: z.array(
    z.object({
      id: formSchemaFields.string.optional(),
      position: formSchemaFields.string,
      companyName: formSchemaFields.string,
      startedAt: formSchemaFields.string, // TODO: date
      endedAt: formSchemaFields.string.nullable(), // TODO: date
      description: formSchemaFields.string.nullable(),
    })
  ),
})

export type FormInputValues = z.input<typeof formSchema>

export type FormOutputValues = z.output<typeof formSchema>

export const formResolver = zodResolver(formSchema)

export const getFormDefaultValues = (
  user?: User
): DeepPartial<FormInputValues> => ({
  avatar: user?.candidate?.avatar ?? null,
  firstName: user?.candidate?.firstName,
  lastName: user?.candidate?.lastName,
  patronymic: user?.candidate?.patronymic ?? null,
  bornAt: user?.candidate?.bornAt,
  cityId: user?.candidate?.city?.id ?? null,
  email: user?.email,
  phoneNumber: user?.candidate?.phoneNumber ?? null,
  tgUsername: user?.candidate?.tgUsername ?? null,
  // skillIds: formSchemaFields.
  description: user?.candidate?.description ?? null,
  workExperience: user?.candidate?.workExperience ?? [],
})

export const formDefaultWorkExperienceItem: DeepPartial<
  FormOutputValues["workExperience"][0]
> = {
  id: undefined,
  position: undefined,
  companyName: undefined,
  startedAt: undefined,
  endedAt: undefined,
  description: null,
}
