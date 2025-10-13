import { Injectable, NotFoundException } from "@nestjs/common"
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "./entities/user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  private createQueryBuider() {
    const qb = this.usersRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.recruiter", "recruiter")
      .leftJoinAndSelect("user.candidate", "candidate")

    return qb
  }

  private async findOne(
    where: FindOptionsWhere<User>,
    options?: {
      selectPassword?: boolean
    },
  ) {
    const qb = this.createQueryBuider().setFindOptions({ where })

    if (options?.selectPassword) {
      qb.addSelect("user.password")
    }

    const user = await qb.getOne()

    if (!user) {
      throw new NotFoundException("User not found") // TODO: unified exception
    }

    return user
  }

  findOneById(id: string) {
    return this.findOne({ id })
  }

  findOneForAuth(email: string) {
    return this.findOne({ email }, { selectPassword: true })
  }

  async create(data: DeepPartial<User>) {
    const user = this.usersRepo.create(data)
    const savedUser = await this.usersRepo.save(user)

    return this.findOneById(savedUser.id)
  }

  async isEmailAvailable(email: string) {
    try {
      await this.findOne({ email })
    } catch (e) {
      if (e instanceof NotFoundException) {
        return true
      }
      throw e
    }

    return false
  }
}
