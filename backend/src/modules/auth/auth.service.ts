import { BadRequestException, Injectable } from "@nestjs/common"
import * as argon2 from "argon2"

import { UsersService } from "@/modules/users/users.service"
import { User } from "@/modules/users/entities/user.entity"

import { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto): Promise<User> {
    if (!(await this.usersService.isEmailAvailable(dto.email))) {
      throw new BadRequestException("Email is already in use") // TODO: unufied exception with key
    }

    return this.usersService.create({
      ...dto,
      password: await argon2.hash(dto.password),
    })
  }
}
