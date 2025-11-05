import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string | null
}
