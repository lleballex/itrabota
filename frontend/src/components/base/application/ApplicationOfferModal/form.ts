import { zodResolver } from "@hookform/resolvers/zod"
import { DeepPartial } from "react-hook-form"
import z from "zod"

import { formSchemaFields } from "@/lib/form-schema-fields"

const formSchema = z.object({
  message: formSchemaFields.string,
})

export const formResolver = zodResolver(formSchema)

export type FormInputValues = z.input<typeof formSchema>

export type FormOutputValues = z.output<typeof formSchema>

export const formDefaultValues: DeepPartial<FormInputValues> = {
  message: undefined,
}
