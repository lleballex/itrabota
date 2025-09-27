import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { DeepPartial } from "react-hook-form"

import { formSchemaFields } from "@/lib/form-schema-fields"
import { User } from "@/types/entities/user"
import { Company } from "@/types/entities/company"

const formSchema = z.object({
  email: formSchemaFields.email,
  firstName: formSchemaFields.string,
  lastName: formSchemaFields.string,
  patronymic: formSchemaFields.string.nullable(),
  company: z.object({
    name: formSchemaFields.string,
    url: formSchemaFields.url.nullable(),
    logo: formSchemaFields.file.nullable(),
  }),
})

export type FormValues = z.infer<typeof formSchema>

export const formResolver = zodResolver(formSchema)

export const getFormDefaultValues = (user?: User): DeepPartial<FormValues> => {
  let company: Company | undefined

  if (user?.profile && "company" in user.profile) {
    company = user.profile.company
  }

  return {
    email: user?.email,
    firstName: user?.profile?.firstName,
    lastName: user?.profile?.lastName,
    patronymic: user?.profile?.patronymic ?? null,
    company: {
      name: company?.name,
      url: company?.url ?? null,
      logo: company?.logo ?? null,
    },
  }
}
