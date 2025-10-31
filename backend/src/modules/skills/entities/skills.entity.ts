import { BaseEntity } from "@/database/entities/base.entity"
import { Column, Entity } from "typeorm"

@Entity("skill")
export class Skill extends BaseEntity {
  @Column("varchar")
  name!: string
}
