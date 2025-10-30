import { Type } from "class-transformer"
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"

class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  url?: string | null

  @Type(() => CreateAttachmentDto)
  @ValidateNested()
  @IsOptional()
  logo?: CreateAttachmentDto | null
}

export class UpdateMeRecruiterDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string

  @IsString()
  @IsOptional()
  patronymic?: string | null

  @IsEmail()
  @IsOptional()
  email?: string

  @Type(() => UpdateCompanyDto)
  @ValidateNested()
  @IsOptional()
  company?: UpdateCompanyDto
}
