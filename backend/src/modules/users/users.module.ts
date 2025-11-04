import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { CompaniesModule } from "@/modules/companies/companies.module"

import { User } from "./entities/user.entity"
import { Recruiter } from "./entities/recruiter.entity"
import { Candidate } from "./entities/candidate.entity"
import { UsersService } from "./users.service"
import { RecruitersService } from "./recruiters.service"
import { WorkExperienceItem } from "./entities/work-experence-item.entity"
import { CandidatesService } from "./candidates.service"
import { WorkExperienceService } from "./work-experience.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Candidate, Recruiter, WorkExperienceItem]), // TODO: remove and recruiter
    CompaniesModule,
  ],
  providers: [
    UsersService,
    RecruitersService,
    CandidatesService,
    WorkExperienceService,
  ],
  exports: [
    UsersService,
    RecruitersService,
    CandidatesService,
    WorkExperienceService,
  ],
})
export class UsersModule {}
