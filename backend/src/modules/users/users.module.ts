import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { CompaniesModule } from "@/modules/companies/companies.module"

import { User } from "./entities/user.entity"
import { Recruiter } from "./entities/recruiter.entity"
import { Candidate } from "./entities/candidate.entity"
import { UsersService } from "./users.service"
import { RecruitersService } from "./recruiters.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Candidate, Recruiter]), // TODO: remove and recruiter
    CompaniesModule,
  ],
  providers: [UsersService, RecruitersService],
  exports: [UsersService, RecruitersService],
})
export class UsersModule {}
