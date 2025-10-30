import { Column, Entity, JoinColumn, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Attachment } from "@/modules/attachments/entities/attachment.entity"
import { Recruiter } from "@/modules/users/entities/recruiter.entity"

@Entity("company")
export class Company extends BaseEntity {
  @Column("varchar")
  name!: string

  @Column("varchar", { nullable: true })
  url!: string | null

  @OneToOne(() => Attachment, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  logo?: Attachment | null

  @OneToOne(() => Recruiter, (recruiter) => recruiter.company, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  recruiter?: Recruiter
}
