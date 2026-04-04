import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm"

import { ICurrentUser } from "@/modules/auth/interfaces/current-user.interface"
import { UsersService } from "@/modules/users/users.service"
import { VacanciesService } from "@/modules/vacancies/vacancies.service"
import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"

import { Application } from "./entities/application.entity"
import { CreateApplicationDto } from "./dto/create-application.dto"
import { ApplicationMessagesService } from "./application-messages.service"
import { UserRole } from "../users/types/user-role"
import { ApplicationMessageType } from "./entities/application-message.entity"
import { GetRecruiterApplicationsDto } from "./dto/get-recruiter-applications.dto"

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,

    private readonly dataSource: DataSource,
    private readonly messagesService: ApplicationMessagesService,
    private readonly usersService: UsersService,
    private readonly vacanciesService: VacanciesService,
  ) {}

  private createQB(manager?: EntityManager) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    return repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.messages", "message")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .orderBy("application.createdAt", "DESC")
      .orderBy("message.createdAt", "ASC")
  }

  private async findOne(
    where: FindOptionsWhere<Application>,
    manager?: EntityManager,
  ) {
    const application = await this.createQB(manager)
      .setFindOptions({ where })
      .getOne()

    if (!application) {
      throw new NotFoundException("Application not found")
    }

    return application
  }

  private async validateBeforeCreating(
    vacancy: Vacancy,
    candidate: Candidate,
    manager?: EntityManager,
  ) {
    try {
      await this.findOne(
        {
          vacancy: { id: vacancy.id },
          candidate: { id: candidate.id },
        },
        manager,
      )
    } catch (e) {
      if (e instanceof NotFoundException) {
        return
      }
      throw e
    }

    throw new ConflictException("Application already exists")
  }

  async findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, manager)
  }

  async findOneForCurCandidate(vacancyId: string, user_: ICurrentUser) {
    const vacancy = await this.vacanciesService.findOneById(vacancyId)
    const user = await this.usersService.findFilledCandidateById(user_.id)
    const application = await this.findOne({
      vacancy: { id: vacancy.id },
      candidate: { id: user.candidate.id },
    })

    return application
  }

  async findAllForRecruiter(
    dto: GetRecruiterApplicationsDto,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.createQB()
      .leftJoin("application.vacancy", "vacancy")
      .leftJoin("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("application.candidate", "candidate")
      .where("recruiter.id = :recruiterId", { recruiterId: user.recruiter.id })

    if (dto.vacancyId) {
      qb.andWhere("vacancy.id = :vacancyId", {
        vacancyId: dto.vacancyId,
      })
    }

    return qb.getMany()
  }

  async create(
    dto: CreateApplicationDto,
    vacancyId: string,
    user_: ICurrentUser,
  ) {
    const applicationId = await this.dataSource.transaction(async (manager) => {
      const applicationsRepo = manager.getRepository(Application)

      const vacancy = await this.vacanciesService.findOneById(
        vacancyId,
        manager,
      )
      const user = await this.usersService.findFilledCandidateById(
        user_.id,
        manager,
      )

      await this.validateBeforeCreating(vacancy, user.candidate, manager)

      const application = await applicationsRepo.save(
        applicationsRepo.create({
          vacancy: { id: vacancy.id },
          candidate: { id: user.candidate.id },
        }),
      )

      await this.messagesService.create(
        {
          application: { id: application.id },
          type: ApplicationMessageType.CandidateResponded,
          senderRole: UserRole.Candidate,
        },
        manager,
      )

      if (dto.message) {
        await this.messagesService.create(
          {
            application: { id: application.id },
            type: ApplicationMessageType.UserMessage,
            senderRole: UserRole.Candidate,
            content: dto.message,
          },
          manager,
        )
      }

      return application.id
    })

    return this.findOneById(applicationId)
  }
}
