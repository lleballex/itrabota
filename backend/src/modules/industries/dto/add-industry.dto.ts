import { IsUUID } from "class-validator"

export class AddIndustryDto {
  @IsUUID()
  id!: string
}
