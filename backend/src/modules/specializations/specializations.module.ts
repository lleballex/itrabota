import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Specialization } from "./entities/specialization.entity"
import { SpecializationsController } from "./specializations.controller"
import { SpecializationsService } from "./specializations.service"

@Module({
  imports: [TypeOrmModule.forFeature([Specialization])],
  controllers: [SpecializationsController],
  providers: [SpecializationsService],
})
export class SpecializationsModule {}
