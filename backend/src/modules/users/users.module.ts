import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "./entities/user.entity"
import { Recruiter } from "./entities/recruiter.entity"
import { Candidate } from "./entities/candidate.entity"
import { UsersService } from "./users.service"
import { Company } from "./entities/company.entity"
import { RecruitersService } from "./recruiters.service"
import { CompaniesService } from "./companies.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, Candidate, Recruiter, Company])], // TODO: remove and recruiter
  providers: [UsersService, RecruitersService, CompaniesService],
  exports: [UsersService, RecruitersService, CompaniesService],
})
export class UsersModule {}
