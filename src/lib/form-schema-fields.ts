import z from "zod"

export const formSchemaFields = {
  email: z.email({ error: "EMAIL_NOT_FILLED" }),
  string: z.string({ error: "STRING_NOT_FILLED" }),
  number: z
    .union(
      [
        z
          .string()
          .nullable()
          .transform((val) => (val ? Number(val) : null)),
        z.number().nullable(),
      ],
      { error: "NUMBER_NOT_FILLED" }
    )
    .pipe(z.number({ error: "NUMBER_NOT_FILLED" })),
  url: z.url({ error: "URL_NOT_FILLED" }),
  file: z.string({ error: "FILE_NOT_FILLED" }),
  boolean: z.boolean({ error: "BOOLEAN_NOT_FILLED" }),
}
