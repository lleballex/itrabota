import { Module } from "@nestjs/common"

import { UsersModule } from "@/modules/users/users.module"
import { AttachmentsModule } from "@/modules/attachments/attachments.module"

import { MeController } from "./me.controller"
import { MeRecruiterService } from "./me-recruiter.service"

@Module({
  imports: [UsersModule, AttachmentsModule],
  controllers: [MeController],
  providers: [MeRecruiterService],
})
export class MeModule {}
