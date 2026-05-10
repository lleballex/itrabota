import { DeepPartial } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { formSchemaFields } from "@/lib/form-schema-fields"
import { User } from "@/types/entities/user"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/types/entities/vacancy"

const formSchema = z.object({
  avatar: formSchemaFields.file.nullable(),
  firstName: formSchemaFields.string,
  lastName: formSchemaFields.string,
  patronymic: formSchemaFields.string.nullable(),
  bornAt: formSchemaFields.string, // TODO: date
  isHidden: formSchemaFields.boolean,
  cityId: formSchemaFields.relation.nullable(),
  specializationId: formSchemaFields.relation.nullable(),
  employmentType: z.enum(VacancyEmploymentType).nullable(),
  format: z.enum(VacancyFormat).nullable(),
  schedule: z.enum(VacancySchedule).nullable(),
  salaryFrom: formSchemaFields.number
    .pipe(z.number().int().positive())
    .nullable(),
  salaryTo: formSchemaFields.number
    .pipe(z.number().int().positive())
    .nullable(),
  email: formSchemaFields.email,
  phoneNumber: formSchemaFields.string.nullable(), // TODO: maybe phone
  tgUsername: formSchemaFields.string.nullable(),
  skillIds: z.array(formSchemaFields.relation),
  description: formSchemaFields.string.nullable(),
  education: formSchemaFields.string.nullable(),
  githubUrl: formSchemaFields.url.nullable(),
  gitlabUrl: formSchemaFields.url.nullable(),
  workExperience: z.array(
    z.object({
      id: formSchemaFields.string.optional(),
      position: formSchemaFields.string,
      companyName: formSchemaFields.string,
      startedAt: formSchemaFields.string, // TODO: date
      endedAt: formSchemaFields.string.nullable(), // TODO: date
      description: formSchemaFields.string.nullable(),
    }),
  ),
  projects: z.array(
    z.object({
      id: formSchemaFields.string.optional(),
      title: formSchemaFields.string,
      url: formSchemaFields.url.nullable(),
      description: formSchemaFields.string.nullable(),
      skillIds: z.array(formSchemaFields.relation),
    }),
  ),
})

export type FormInputValues = z.input<typeof formSchema>

export type FormOutputValues = z.output<typeof formSchema>

export const formResolver = zodResolver(formSchema)

export const getFormDefaultValues = (
  user?: User,
): DeepPartial<FormInputValues> => ({
  avatar: user?.candidate?.avatar ?? null,
  firstName: user?.candidate?.firstName,
  lastName: user?.candidate?.lastName,
  patronymic: user?.candidate?.patronymic ?? null,
  bornAt: user?.candidate?.bornAt,
  isHidden: user?.candidate?.isHidden ?? false,
  cityId: user?.candidate?.city?.id ?? null,
  specializationId: user?.candidate?.specialization?.id ?? null,
  employmentType: user?.candidate?.employmentType ?? null,
  format: user?.candidate?.format ?? null,
  schedule: user?.candidate?.schedule ?? null,
  salaryFrom: user?.candidate?.salaryFrom ?? null,
  salaryTo: user?.candidate?.salaryTo ?? null,
  email: user?.email,
  phoneNumber: user?.candidate?.phoneNumber ?? null,
  tgUsername: user?.candidate?.tgUsername ?? null,
  skillIds: user?.candidate?.skills?.map((skill) => skill.id) ?? [],
  description: user?.candidate?.description ?? null,
  education: user?.candidate?.education ?? null,
  githubUrl: user?.candidate?.githubUrl ?? null,
  gitlabUrl: user?.candidate?.gitlabUrl ?? null,
  workExperience: user?.candidate?.workExperience ?? [],
  projects:
    user?.candidate?.projects?.map((project) => ({
      ...project,
      skillIds: project.skills?.map((skill) => skill.id) ?? [],
    })) ?? [],
})

export const formDefaultWorkExperienceItem: FormOutputValues["workExperience"][0] = {
  id: undefined,
  position: "",
  companyName: "",
  startedAt: "",
  endedAt: null,
  description: null,
}

export const formDefaultProjectItem: FormOutputValues["projects"][0] = {
  id: undefined,
  title: "",
  url: null,
  description: null,
  skillIds: [],
}
