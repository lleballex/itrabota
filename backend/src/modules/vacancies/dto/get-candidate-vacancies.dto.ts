import { Transform, Type } from "class-transformer"
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
} from "class-validator"

import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyWorkExperience,
} from "../entities/vacancy.entity"

function queryValueToArray({ value }: { value: unknown }): unknown[] {
  if (Array.isArray(value)) {
    return [...(value as unknown[])]
  }

  return [value]
}

function queryValueToBoolean({ value }: { value: unknown }) {
  if (value === "true") return true
  if (value === "false") return false

  return value
}

export class GetCandidateVacanciesDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string

  @IsBoolean()
  @Transform(queryValueToBoolean)
  @IsOptional()
  matchForMe?: boolean

  @IsArray()
  @IsEnum(VacancyEmploymentType, { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  employmentTypes?: VacancyEmploymentType[]

  @IsArray()
  @IsEnum(VacancyFormat, { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  formats?: VacancyFormat[]

  @IsArray()
  @IsEnum(VacancySchedule, { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  schedules?: VacancySchedule[]

  @IsArray()
  @IsEnum(VacancyWorkExperience, { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  workExperiences?: VacancyWorkExperience[]

  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  specializationIds?: string[]

  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  cityIds?: string[]

  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(queryValueToArray)
  @IsOptional()
  skillIds?: string[]

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  salaryFrom?: number

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  salaryTo?: number
}
