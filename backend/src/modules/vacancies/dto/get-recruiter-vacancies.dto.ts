import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

import { UserRole } from "@/modules/users/types/user-role"

import { VacancyStatus } from "../entities/vacancy.entity"

export class GetRecruiterVacanciesDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string

  @IsEnum(VacancyStatus)
  @IsOptional()
  @ApiProperty({
    enum: UserRole,
    enumName: "UserRole",
  })
  status?: VacancyStatus
}
