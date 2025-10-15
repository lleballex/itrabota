import { Type } from "class-transformer"
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { CreateCompanyDto } from "./create-company.dto"

export class CreateRecruiterDto {
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
