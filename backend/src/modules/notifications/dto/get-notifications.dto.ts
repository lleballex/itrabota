import { IsInt, IsOptional, Min } from "class-validator"
import { Type } from "class-transformer"

export class GetNotificationsDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number
}
