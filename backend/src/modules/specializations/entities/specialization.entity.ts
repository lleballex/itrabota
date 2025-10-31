import { Column, Entity } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

@Entity("specialization")
export class Specialization extends BaseEntity {
  @Column("varchar")
  name!: string
}
