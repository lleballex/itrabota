import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from "class-validator"

import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/modules/vacancies/entities/vacancy.entity"

class CreateWorkExperienceItemDto {
  @IsString()
  @IsNotEmpty()
  position!: string

  @IsString()
  @IsNotEmpty()
  companyName!: string

  @IsDateString()
  startedAt!: string

  @IsDateString()
  @IsOptional()
  endedAt?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string | null
}

class CreateCandidateProjectItemDto {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsUrl()
  @IsOptional()
  url?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string | null

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  skillIds?: string[]
}

export class CreateMeCandidateDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string

  @IsString()
  @IsNotEmpty()
  lastName!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  patronymic?: string | null

  @IsDateString()
  bornAt!: string

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tgUsername?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  education?: string | null

  @IsUrl()
  @IsOptional()
  githubUrl?: string | null

  @IsUrl()
  @IsOptional()
  gitlabUrl?: string | null

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean

  @IsUUID("4")
  @IsOptional()
  cityId?: string | null

  @IsUUID("4")
  @IsOptional()
  specializationId?: string | null

  @IsEnum(VacancyEmploymentType)
  @IsOptional()
  employmentType?: VacancyEmploymentType | null

  @IsEnum(VacancyFormat)
  @IsOptional()
  format?: VacancyFormat | null

  @IsEnum(VacancySchedule)
  @IsOptional()
  schedule?: VacancySchedule | null

  @IsInt()
  @IsPositive()
  @IsOptional()
  salaryFrom?: number | null

  @IsInt()
  @IsPositive()
  @IsOptional()
  salaryTo?: number | null

  @Type(() => CreateAttachmentDto)
  @ValidateNested()
  @IsOptional()
  avatar?: CreateAttachmentDto | null

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  skillIds?: string[]

  @IsArray()
  @Type(() => CreateWorkExperienceItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  workExperience?: CreateWorkExperienceItemDto[]

  @IsArray()
  @Type(() => CreateCandidateProjectItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  projects?: CreateCandidateProjectItemDto[]
}
