import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from "class-validator"

import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/modules/vacancies/entities/vacancy.entity"

function queryValueToArray({ value }: { value: unknown }): unknown[] {
  if (Array.isArray(value)) {
    return [...(value as unknown[])]
  }

  return [value]
}

export class GetRecruiterCandidatesDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string

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

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  totalWorkExperienceMonthsMin?: number

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  projectsCountMin?: number

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  ageFrom?: number

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  ageTo?: number
}
