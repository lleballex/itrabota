import { Type } from "class-transformer"
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"

class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsOptional()
  url?: string | null

  @Type(() => CreateAttachmentDto)
  @ValidateNested()
  @IsOptional()
  logo?: CreateAttachmentDto | null

  @IsUUID("4")
  industryId!: string
}

export class CreateMeRecruiterDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string

  @IsString()
  @IsNotEmpty()
  lastName!: string

  @IsString()
  @IsOptional()
  patronymic?: string | null

  @IsEmail()
  @IsOptional()
  email?: string

  @Type(() => CreateCompanyDto)
  @ValidateNested()
  company!: CreateCompanyDto
}
