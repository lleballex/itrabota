import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Skill } from "./entities/skills.entity"
import { SkillsController } from "./skills.controller"
import { SkillsService } from "./skills.service"

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
