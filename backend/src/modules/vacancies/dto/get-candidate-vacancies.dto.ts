import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class GetCandidateVacanciesDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string
}
