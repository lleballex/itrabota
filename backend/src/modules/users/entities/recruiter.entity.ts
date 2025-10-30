import { Column, Entity, JoinColumn, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Company } from "@/modules/companies/entities/company.entity"

import { User } from "./user.entity"

@Entity("recruiter")
export class Recruiter extends BaseEntity {
  @Column("varchar")
  firstName!: string

  @Column("varchar")
  lastName!: string

  @Column("varchar", { nullable: true })
  patronymic!: string | null

  @OneToOne(() => User, (user) => user.recruiter, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user?: User

  @OneToOne(() => Company, (company) => company.recruiter, {
    nullable: false,
    onDelete: "CASCADE",
  })
  company?: Company
}
