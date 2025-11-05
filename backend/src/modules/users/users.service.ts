import { Injectable, NotFoundException } from "@nestjs/common"
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { WithRequired } from "@/common/types/with-required.type"
import { UserRole } from "@/modules/users/types/user-role"
import { WithConcreted } from "@/common/types/with-concreted.type"

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
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.logo", "logo")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("user.candidate", "candidate")
      .leftJoinAndSelect("candidate.city", "city")
      .leftJoinAndSelect("candidate.workExperience", "workExperienceItem")
      .leftJoinAndSelect("candidate.avatar", "avatar")

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
    const user = await this.findOneById(id)

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

  async findCandidateById(id: string) {
    const user = await this.findOneById(id)

    if (user.role !== UserRole.Candidate) {
      throw new Error("User must be a candidate")
    }

    return user as WithConcreted<typeof user, "role", typeof UserRole.Candidate>
  }

  async findFilledCandidateById(id: string) {
    const user = await this.findCandidateById(id)

    if (!user.candidate) {
      throw new Error("Candidate must be filled")
    }

    return user as WithRequired<typeof user, "candidate">
  }

  async create(data: DeepPartial<User>) {
    const user = this.usersRepo.create(data)
    const savedUser = await this.usersRepo.save(user)

    return this.findOneById(savedUser.id)
  }

  async update(id: string, data: DeepPartial<User>) {
    const user = this.usersRepo.create({ id, ...data })
    await this.usersRepo.save(user)

    return this.findOneById(id)
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
