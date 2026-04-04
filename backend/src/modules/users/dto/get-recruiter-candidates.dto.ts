import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class GetRecruiterCandidatesDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string
}
