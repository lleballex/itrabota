import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"

import { BaseEntity } from "@/database/entities/base.entity"
import { Application } from "@/modules/applications/entities/application.entity"

import { Vacancy } from "./vacancy.entity"

@Entity("funnel_step")
export class FunnelStep extends BaseEntity {
  @Column("int", { default: 0 })
  index!: number

  @Column("varchar")
  name!: string

  @Column("text", { nullable: true })
  approveMessage!: string | null

  @Column("text", { nullable: true })
  rejectMessage!: string | null

  @Column("bool", { default: false })
  shouldCreateCall!: boolean

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.funnelSteps, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  vacancy?: Vacancy

  @OneToMany(() => Application, (application) => application.vacancy)
  applications?: Application[]
}
