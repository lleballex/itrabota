import { Column, Entity } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"

@Entity("city")
export class City extends BaseEntity {
  @Column("varchar")
  name!: string
}
