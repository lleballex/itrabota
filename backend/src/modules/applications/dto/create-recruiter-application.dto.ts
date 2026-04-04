import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateRecruiterApplicationDto {
  @IsString()
  @IsNotEmpty()
  candidateId!: string

  @IsString()
  @IsNotEmpty()
  vacancyId!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string | null
}
