import { IsBase64, IsInt, IsNotEmpty, IsString, Min } from "class-validator"

export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  mimeType!: string // TODO: validation for mime type

  @IsInt()
  @Min(0)
  size!: number

  @IsBase64()
  @IsNotEmpty()
  content!: string
}
