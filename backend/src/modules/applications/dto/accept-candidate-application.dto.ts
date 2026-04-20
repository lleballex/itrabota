import { IsDateString, IsOptional } from "class-validator"

export class AcceptCandidateApplicationDto {
  @IsOptional()
  @IsDateString()
  meetingStartsAt?: string
}
