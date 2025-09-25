import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { UserRole } from "@/types/entities/user"
import { formSchemaFields } from "@/lib/form-schema-fields"

const formSchema = z
  .object({
    role: z.enum([UserRole.Candidate, UserRole.Rucruiter], {
      error: "ENUM_NOT_FILLED",
    }),
    email: formSchemaFields.email,
    password: formSchemaFields.string,
    passwordRepeat: formSchemaFields.string,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordRepeat) {
      ctx.addIssue({
        code: "custom",
        message: "PASSWORDS_NOT_MATCH",
        path: ["password"],
      })
      ctx.addIssue({
        code: "custom",
        message: "PASSWORDS_NOT_MATCH",
        path: ["passwordRepeat"],
      })
    }
  })

export const formResolver = zodResolver(formSchema)
