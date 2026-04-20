import { IsDateString } from "class-validator"

export class GetMeetingsRangeDto {
  @IsDateString()
  from!: string

  @IsDateString()
  to!: string
}
