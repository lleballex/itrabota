import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator"

import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyWorkExperience,
} from "../entities/vacancy.entity"

export class CreateVacancyDto {
  @IsString()
  @IsNotEmpty()
  title!: string

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
  employmentType!: VacancyEmploymentType

  @IsEnum(VacancyFormat)
  format!: VacancyFormat

  @IsEnum(VacancySchedule)
  schedule!: VacancySchedule

  @IsEnum(VacancyWorkExperience)
  workExperience!: VacancyWorkExperience

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  skillIds?: string[]

  @IsUUID()
  specializationId!: string

  @IsUUID()
  @IsOptional()
  cityId?: string | null
}
