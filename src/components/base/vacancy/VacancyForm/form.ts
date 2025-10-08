import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { DeepPartial } from "react-hook-form"

import {
  Vacancy,
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyWorkExperience,
} from "@/types/entities/vacancy"
import { formSchemaFields } from "@/lib/form-schema-fields"

const formSchema = z.object({
  title: formSchemaFields.string,
  specializationId: formSchemaFields.string, // TODO: error for enum
  employmentType: z.enum(VacancyEmploymentType, { error: "ENUM_NOT_FILLED" }), // TODO: move to file with fields
  format: z.enum(VacancyFormat, { error: "ENUM_NOT_FILLED" }),
  schedule: z.enum(VacancySchedule, { error: "ENUM_NOT_FILLED" }),
  workExperience: z.enum(VacancyWorkExperience, { error: "ENUM_NOT_FILLED" }),
  salaryFrom: formSchemaFields.number
    .pipe(z.number().int().positive())
    .nullable(),
  salaryTo: formSchemaFields.number
    .pipe(z.number().int().positive())
    .nullable(),
  city: formSchemaFields.string.nullable(),
  description: formSchemaFields.string.nullable(),
  requirements: formSchemaFields.string.nullable(),
  niceToHave: formSchemaFields.string.nullable(),
  responsibilites: formSchemaFields.string.nullable(),
  conditions: formSchemaFields.string.nullable(),
  funnel: z.array(
    z.object({
      name: formSchemaFields.string,
      approveMessage: formSchemaFields.string.nullable(),
      rejectMessage: formSchemaFields.string.nullable(),
      shouldCreateCall: formSchemaFields.boolean,
    })
  ),
})

export type FormInputValues = z.input<typeof formSchema>

export type FormOutputValues = z.output<typeof formSchema>

export const formResolver = zodResolver(formSchema)

export const getFormDefaultValues = (
  vacancy?: Vacancy
): DeepPartial<FormInputValues> => ({
  title: vacancy?.title,
  specializationId: vacancy?.specialization?.id,
  employmentType: vacancy?.employmentType,
  format: vacancy?.format,
  schedule: vacancy?.schedule,
  workExperience: vacancy?.workExperience,
  salaryFrom: vacancy?.salaryFrom ?? null,
  salaryTo: vacancy?.salaryTo ?? null,
  city: vacancy?.city?.id ?? null,
  description: vacancy?.description ?? null,
  requirements: vacancy?.requirements ?? null,
  niceToHave: vacancy?.niceToHave ?? null,
  responsibilites: vacancy?.responsibilities ?? null,
  conditions: vacancy?.conditions ?? null,
  // TODO: add funnel
})

export const formDefaultFunnelStep: DeepPartial<FormOutputValues["funnel"][0]> =
  {
    name: undefined,
    approveMessage: null,
    rejectMessage: null,
    shouldCreateCall: false,
  }
