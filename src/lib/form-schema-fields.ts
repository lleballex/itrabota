import z from "zod"

export const formSchemaFields = {
  email: z.email({ error: "EMAIL_NOT_FILLED" }),
  string: z.string({ error: "STRING_NOT_FILLED" }),
}
