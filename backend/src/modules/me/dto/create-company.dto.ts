import { Type } from "class-transformer"
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { CreateAttachmentDto } from "@/modules/attachments/dto/create-attachment.dto"

export class CreateCompanyDto {
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
}
