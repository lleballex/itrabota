import { IsArray, IsUUID } from "class-validator"

export class ReadNotificationsDto {
  @IsArray()
  @IsUUID("4", { each: true })
  ids!: string[]
}
