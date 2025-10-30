import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Attachment } from "@/modules/attachments/entities/attachment.entity"
import { Recruiter } from "@/modules/users/entities/recruiter.entity"
import { Industry } from "@/modules/industries/entities/industry.entity"

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

  @ManyToOne(() => Industry, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn()
  industry?: Industry
}
