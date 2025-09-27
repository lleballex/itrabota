import z from "zod"

export const formSchemaFields = {
  email: z.email({ error: "EMAIL_NOT_FILLED" }),
  string: z.string({ error: "STRING_NOT_FILLED" }),
  url: z.url({ error: "URL_NOT_FILLED" }),
  file: z.string({ error: "FILE_NOT_FILLED" }),
}
