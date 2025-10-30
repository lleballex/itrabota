import { Type } from "class-transformer"
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"
import { AddIndustryDto } from "@/modules/industries/dto/add-industry.dto"

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

  @Type(() => AddIndustryDto)
  @ValidateNested()
  industry!: AddIndustryDto
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
