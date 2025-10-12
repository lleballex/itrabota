import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
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

  async validateUser(data: {
    email: string
    password: string
  }): Promise<User | null> {
    let user: User

    try {
      user = await this.usersService.findOneForAuth(data.email)
    } catch (e) {
      if (e instanceof NotFoundException) {
        return null
      }
      throw e
    }

    if (!user.password) {
      throw new Error("User has no password")
    }

    if (!(await argon2.verify(user.password, data.password))) {
      return null
    }

    return user
  }
}
