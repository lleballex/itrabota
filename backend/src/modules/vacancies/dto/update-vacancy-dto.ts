import {
  IsArray,
  IsBoolean,
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
  VacancyWorkExperience,
} from "../entities/vacancy.entity"
import { Type } from "class-transformer"

class CreateFunnelStepDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  approveMessage?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rejectMessage?: string | null

  @IsBoolean()
  shouldCreateCall!: boolean
}

export class UpdateVacancyDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  requirements?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  niceToHave?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  responsibilities?: string | null

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  conditions?: string | null

  @IsInt()
  @IsPositive()
  @IsOptional()
  salaryFrom?: number | null

  @IsInt()
  @IsPositive()
  @IsOptional()
  salaryTo?: number | null

  @IsEnum(VacancyEmploymentType)
  @IsOptional()
  employmentType?: VacancyEmploymentType

  @IsEnum(VacancyFormat)
  @IsOptional()
  format?: VacancyFormat

  @IsEnum(VacancySchedule)
  @IsOptional()
  schedule?: VacancySchedule

  @IsEnum(VacancyWorkExperience)
  @IsOptional()
  workExperience?: VacancyWorkExperience

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  skillIds?: string[]

  @IsUUID()
  @IsOptional()
  specializationId?: string

  @IsUUID()
  @IsOptional()
  cityId?: string | null

  // @IsArray()
  // @Type(() => CreateFunnelStepDto)
  // @ValidateNested({ each: true })
  // @IsOptional()
  // funnelSteps?: UpdateFunnelStepDto[]
  // TODO: funnel
}
