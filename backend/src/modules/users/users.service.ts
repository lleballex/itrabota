import { Injectable, NotFoundException } from "@nestjs/common"
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { WithRequired } from "@/common/types/with-required.type"

import { User, UserRole } from "./entities/user.entity"
import { WithConcreted } from "@/common/types/with-concreted.type"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  private createQueryBuider() {
    const qb = this.usersRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.logo", "logo")
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

  async findOneForAuth(email: string) {
    const user = await this.findOne({ email }, { selectPassword: true })

    return user as WithRequired<typeof user, "password">
  }

  async findRecruiterById(id: string) {
    const user = await this.findOne({ id })

    if (user.role !== UserRole.Recruiter) {
      throw new Error("User must be a recruiter")
    }

    return user as WithConcreted<typeof user, "role", typeof UserRole.Recruiter>
  }

  async findFilledRecruiterById(id: string) {
    const user = await this.findRecruiterById(id)

    if (!user.recruiter) {
      throw new Error("Recruiter must be filled")
    }

    return user as WithRequired<typeof user, "recruiter">
  }

  async create(data: DeepPartial<User>) {
    const user = this.usersRepo.create(data)
    const savedUser = await this.usersRepo.save(user)

    return this.findOneById(savedUser.id)
  }

  async update(id: string, data: DeepPartial<User>) {
    const user = this.usersRepo.create({ id, ...data })
    const savedUser = await this.usersRepo.save(user)

    return this.findOneById(savedUser.id)
  }

  async isEmailAvailable(email: string, options?: { userId?: string }) {
    let user: User

    try {
      user = await this.findOne({ email })
    } catch (e) {
      if (e instanceof NotFoundException) {
        return true
      }
      throw e
    }

    if (user.id === options?.userId) {
      return true
    }

    return false
  }
}
