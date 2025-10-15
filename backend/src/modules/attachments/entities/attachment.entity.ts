import { Column, Entity } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

@Entity("attachment")
export class Attachment extends BaseEntity {
  @Column("varchar")
  name!: string

  @Column("varchar")
  mimeType!: string

  @Column("int")
  size!: number

  @Column("bytea", { select: false })
  content?: Buffer
}
