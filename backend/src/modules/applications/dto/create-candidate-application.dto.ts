import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCandidateApplicationDto {
  @IsString()
  @IsNotEmpty()
  vacancyId!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string | null
}
