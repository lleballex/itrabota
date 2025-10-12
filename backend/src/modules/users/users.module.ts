import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "./entities/user.entity"
import { Recruiter } from "./entities/recruiter.entity"
import { Candidate } from "./entities/candidate.entity"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, Candidate, Recruiter])], // TODO: remove candidate and recruiter
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
