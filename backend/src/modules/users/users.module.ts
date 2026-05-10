import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { CompaniesModule } from "@/modules/companies/companies.module"
import { SkillsModule } from "@/modules/skills/skills.module"

import { User } from "./entities/user.entity"
import { Recruiter } from "./entities/recruiter.entity"
import { Candidate } from "./entities/candidate.entity"
import { UsersService } from "./users.service"
import { RecruitersService } from "./recruiters.service"
import { WorkExperienceItem } from "./entities/work-experence-item.entity"
import { CandidatesService } from "./candidates.service"
import { WorkExperienceService } from "./work-experience.service"
import { CandidatesController } from "./candidates.controller"
import { CandidateProjectItem } from "./entities/candidate-project-item.entity"
import { CandidateProjectsService } from "./candidate-projects.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Candidate,
      Recruiter,
      WorkExperienceItem,
      CandidateProjectItem,
    ]), // TODO: remove and recruiter
    CompaniesModule,
    SkillsModule,
  ],
  controllers: [CandidatesController],
  providers: [
    UsersService,
    RecruitersService,
    CandidatesService,
    WorkExperienceService,
    CandidateProjectsService,
  ],
  exports: [
    UsersService,
    RecruitersService,
    CandidatesService,
    WorkExperienceService,
    CandidateProjectsService,
  ],
})
export class UsersModule {}
