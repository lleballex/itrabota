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
  IsUUID,
  ValidateNested,
} from "class-validator"

import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/modules/vacancies/entities/vacancy.entity"

class CreateOrUpdateWorkExperienceItemDto {
  @IsUUID("4")
  @IsOptional()
  id?: string

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

export class UpdateMeCandidateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  patronymic?: string | null

  @IsDateString()
  @IsOptional()
  bornAt?: string

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
  @Type(() => CreateOrUpdateWorkExperienceItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  workExperience?: CreateOrUpdateWorkExperienceItemDto[]
}
