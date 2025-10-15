import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import * as argon2 from "argon2"
import { JwtService } from "@nestjs/jwt"

import { UsersService } from "@/modules/users/users.service"
import { User } from "@/modules/users/entities/user.entity"

import { RegisterDto } from "./dto/register.dto"
import { ICurrentUser } from "./interfaces/current-user.interface"
import { IJwtPayload } from "./interfaces/jwt-payload.interface"
import { WithRequired } from "@/common/types/with-required.type"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateJwt(user: ICurrentUser): Promise<string> {
    const payload: IJwtPayload = {
      sub: user.id,
    }

    return this.jwtService.signAsync(payload)
  }

  async validateUser(data: {
    email: string
    password: string
  }): Promise<User | null> {
    let user: WithRequired<User, "password">

    try {
      user = await this.usersService.findOneForAuth(data.email)
    } catch (e) {
      if (e instanceof NotFoundException) {
        return null
      }
      throw e
    }

    if (!(await argon2.verify(user.password, data.password))) {
      return null
    }

    return user
  }

  login(user: ICurrentUser): Promise<string> {
    return this.generateJwt(user)
  }

  async register(dto: RegisterDto): Promise<string> {
    if (!(await this.usersService.isEmailAvailable(dto.email))) {
      throw new BadRequestException("Email is already in use") // TODO: unufied exception with key
    }

    const user = await this.usersService.create({
      ...dto,
      password: await argon2.hash(dto.password),
    })

    return this.generateJwt({ id: user.id })
  }
}
