import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

import { UserRole } from "@/modules/users/entities/user.entity"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string

  @IsEnum(UserRole)
  @ApiProperty({
    enum: UserRole,
    enumName: "UserRole",
  })
  role!: UserRole
}
