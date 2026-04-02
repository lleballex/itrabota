import { IsOptional, IsUUID } from "class-validator"

export class GetRecruiterApplicationsDto {
  @IsUUID()
  @IsOptional()
  vacancyId?: string
}
