import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { formSchemaFields } from "@/lib/form-schema-fields"

const formSchema = z.object({
  email: formSchemaFields.email,
  password: formSchemaFields.string,
})

export const formResolver = zodResolver(formSchema)
