import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common"
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { WithRequired } from "@/common/types/with-required.type"
import { UserRole } from "@/modules/users/types/user-role"
import { WithConcreted } from "@/common/types/with-concreted.type"

import { User } from "./entities/user.entity"
import { calculateTotalWorkExperienceMonths } from "./lib/calculate-total-work-experience-months"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  private createQueryBuider(manager?: EntityManager) {
    const repo = manager?.getRepository(User) ?? this.usersRepo

    const qb = repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.recruiter", "recruiter")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.logo", "logo")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("user.candidate", "candidate")
      .leftJoinAndSelect("candidate.city", "city")
      .leftJoinAndSelect("candidate.specialization", "candidateSpecialization")
      .leftJoinAndSelect("candidate.skills", "candidateSkills")
      .leftJoinAndSelect("candidate.workExperience", "workExperienceItem")
      .leftJoinAndSelect("candidate.projects", "candidateProjectItem")
      .leftJoinAndSelect(
        "candidateProjectItem.skills",
        "candidateProjectSkills",
      )
      .leftJoinAndSelect("candidate.avatar", "avatar")

    return qb
  }

  private async findOne(
    where: FindOptionsWhere<User>,
    options?: {
      selectPassword?: boolean
      manager?: EntityManager
    },
  ) {
    const qb = this.createQueryBuider(options?.manager).setFindOptions({
      where,
    })

    if (options?.selectPassword) {
      qb.addSelect("user.password")
    }

    const user = await qb.getOne()

    if (!user) {
      throw new NotFoundException("Пользователь не найден") // TODO: unified exception
    }

    if (user.candidate) {
      user.candidate.totalWorkExperienceMonths =
        calculateTotalWorkExperienceMonths(user.candidate.workExperience)
    }

    return user
  }

  findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, { manager })
  }

  async findOneForAuth(email: string) {
    const user = await this.findOne({ email }, { selectPassword: true })

    return user as WithRequired<typeof user, "password">
  }

  async findRecruiterById(id: string, manager?: EntityManager) {
    const user = await this.findOneById(id, manager)

    if (user.role !== UserRole.Recruiter) {
      throw new ForbiddenException("Пользователь не является рекрутером")
    }

    return user as WithConcreted<typeof user, "role", typeof UserRole.Recruiter>
  }

  async findFilledRecruiterById(id: string, manager?: EntityManager) {
    const user = await this.findRecruiterById(id, manager)

    if (!user.recruiter) {
      throw new UnprocessableEntityException("Профиль рекрутера не заполнен")
    }

    return user as WithRequired<typeof user, "recruiter">
  }

  async findCandidateById(id: string, manager?: EntityManager) {
    const user = await this.findOneById(id, manager)

    if (user.role !== UserRole.Candidate) {
      throw new ForbiddenException("Пользователь не является кандидатом")
    }

    return user as WithConcreted<typeof user, "role", typeof UserRole.Candidate>
  }

  async findFilledCandidateById(id: string, manager?: EntityManager) {
    const user = await this.findCandidateById(id, manager)

    if (!user.candidate) {
      throw new UnprocessableEntityException("Профиль кандидата не заполнен")
    }

    return user as WithRequired<typeof user, "candidate">
  }

  async create(data: DeepPartial<User>, manager?: EntityManager) {
    const repo = manager?.getRepository(User) ?? this.usersRepo

    const user = repo.create(data)
    const savedUser = await repo.save(user)

    return this.findOneById(savedUser.id, manager)
  }

  async update(id: string, data: DeepPartial<User>, manager?: EntityManager) {
    const repo = manager?.getRepository(User) ?? this.usersRepo
    const user = repo.create({ id, ...data })

    await repo.save(user)

    return this.findOneById(id, manager)
  }

  async isEmailAvailable(
    email: string,
    options?: { userId?: string; manager?: EntityManager },
  ) {
    let user: User

    try {
      user = await this.findOne({ email }, { manager: options?.manager })
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
