import { zodResolver } from "@hookform/resolvers/zod"
import { DeepPartial } from "react-hook-form"
import z from "zod"

import { formSchemaFields } from "@/lib/form-schema-fields"
import { ApplicationStageRecommendation } from "@/types/entities/application-stage-result"

const nullableTextareaField = formSchemaFields.string.nullable().optional()

const formSchema = z
  .object({
    summary: nullableTextareaField,
    pros: nullableTextareaField,
    cons: nullableTextareaField,
    notes: nullableTextareaField,
    recommendation: z.enum(ApplicationStageRecommendation).nullable().optional(),
  })
  .refine(
    (data) =>
      Boolean(
        data.summary?.trim() ||
          data.pros?.trim() ||
          data.cons?.trim() ||
          data.notes?.trim() ||
          data.recommendation,
      ),
    {
      message: "Заполните хотя бы одно поле",
      path: ["summary"],
    },
  )

export const formResolver = zodResolver(formSchema)

export type FormInputValues = z.input<typeof formSchema>

export type FormOutputValues = z.output<typeof formSchema>

export const formDefaultValues: DeepPartial<FormInputValues> = {
  summary: null,
  pros: null,
  cons: null,
  notes: null,
  recommendation: null,
}
