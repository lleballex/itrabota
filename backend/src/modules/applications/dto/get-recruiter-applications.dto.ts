import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

import {
  ApplicationStatus,
  ApplicationType,
} from "../entities/application.entity"

export class GetRecruiterApplicationsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  candidateId?: string

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus

  @IsEnum(ApplicationType)
  @IsOptional()
  type?: ApplicationType
}
