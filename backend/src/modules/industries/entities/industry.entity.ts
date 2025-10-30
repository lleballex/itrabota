import { Column, Entity } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

@Entity("industry")
export class Industry extends BaseEntity {
  @Column("varchar")
  name!: string
}
