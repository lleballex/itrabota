import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { DeepPartial } from "react-hook-form"

import { formSchemaFields } from "@/lib/form-schema-fields"
import { User } from "@/types/entities/user"

const formSchema = z.object({
  email: formSchemaFields.email,
  firstName: formSchemaFields.string,
  lastName: formSchemaFields.string,
  patronymic: formSchemaFields.string.nullable(),
  company: z.object({
    name: formSchemaFields.string,
    url: formSchemaFields.url.nullable(),
    logo: formSchemaFields.file.nullable(),
    industry: formSchemaFields.relation,
  }),
})

export type FormValues = z.infer<typeof formSchema>

export const formResolver = zodResolver(formSchema)

export const getFormDefaultValues = (user?: User): DeepPartial<FormValues> => {
  return {
    email: user?.email,
    firstName: user?.recruiter?.firstName,
    lastName: user?.recruiter?.lastName,
    patronymic: user?.recruiter?.patronymic ?? null,
    company: {
      name: user?.recruiter?.company?.name,
      url: user?.recruiter?.company?.url ?? null,
      logo: user?.recruiter?.company?.logo ?? null,
      industry: user?.recruiter?.company?.industry,
    },
  }
}
