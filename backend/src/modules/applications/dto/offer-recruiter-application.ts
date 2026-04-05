import { IsNotEmpty, IsString } from "class-validator"

export class OfferRecruiterApplicationDto {
  @IsString()
  @IsNotEmpty()
  message!: string
}
