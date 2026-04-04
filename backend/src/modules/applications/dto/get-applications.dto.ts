import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

import {
  ApplicationStatus,
  ApplicationType,
} from "../entities/application.entity"

export class GetApplicationsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus

  @IsEnum(ApplicationType)
  @IsOptional()
  type?: ApplicationType
}
