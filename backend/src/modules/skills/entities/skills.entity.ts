import { BaseEntity } from "@/database/entities/base.entity"
import { Column, Entity, JoinTable, ManyToMany } from "typeorm"

@Entity("skill")
export class Skill extends BaseEntity {
  @Column("varchar")
  name!: string

  @ManyToMany(() => Skill, (skill) => skill.impliedBy)
  @JoinTable({
    name: "skill_implies_skill",
    joinColumn: {
      name: "skillId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "impliedSkillId",
      referencedColumnName: "id",
    },
  })
  implies?: Skill[]

  @ManyToMany(() => Skill, (skill) => skill.implies)
  impliedBy?: Skill[]

  impliesIds?: string[]
}
