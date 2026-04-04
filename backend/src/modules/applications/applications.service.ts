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

import { Application, ApplicationType } from "./entities/application.entity"
import { CreateApplicationDto } from "./dto/create-application.dto"
import { ApplicationMessagesService } from "./application-messages.service"
import { UserRole } from "../users/types/user-role"
import { ApplicationMessageType } from "./entities/application-message.entity"
import { IApplicationsSearchParams } from "./interfaces/application-service.interface"

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

  private createQB(
    params?: IApplicationsSearchParams,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Application) ?? this.applicationsRepo

    const qb = repo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.messages", "message")
      .leftJoinAndSelect("application.funnelStep", "funnelStep")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.recruiter", "recruiter")
      .leftJoinAndSelect("vacancy.specialization", "specialization")
      .leftJoinAndSelect("recruiter.company", "company")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("company.logo", "companyLogo")
      .leftJoinAndSelect("application.candidate", "candidate")
      .leftJoinAndSelect("candidate.city", "candidateCity")
      .leftJoinAndSelect("candidate.avatar", "candidateAvatar")
      .orderBy("application.createdAt", "DESC")
      .addOrderBy("message.createdAt", "ASC")

    if (params?.vacancyId) {
      qb.andWhere("vacancy.id = :vacancyId", {
        vacancyId: params.vacancyId,
      })
    }

    if (params?.query) {
      qb.andWhere("vacancy.title ILIKE :query", { query: `%${params.query}%` })
    }

    if (params?.type) {
      qb.andWhere("application.type = :type", { type: params?.type })
    }

    if (params?.status) {
      qb.andWhere("application.status = :status", { status: params?.status })
    }

    return qb
  }

  private async findOne(
    where: FindOptionsWhere<Application>,
    manager?: EntityManager,
  ) {
    const application = await this.createQB(undefined, manager)
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

  async findOneForRecruiterById(id: string, user_: ICurrentUser) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    return this.findOne({
      id,
      vacancy: { recruiter: { id: user.recruiter.id } },
    })
  }

  async findOneForCandidateByVacancyId(vacancyId: string, user_: ICurrentUser) {
    const vacancy = await this.vacanciesService.findOneById(vacancyId)
    const user = await this.usersService.findFilledCandidateById(user_.id)
    const application = await this.findOne({
      vacancy: { id: vacancy.id },
      candidate: { id: user.candidate.id },
    })

    return application
  }

  async findAllForRecruiter(
    params: IApplicationsSearchParams,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledRecruiterById(user_.id)

    const qb = this.createQB(params).andWhere("recruiter.id = :recruiterId", {
      recruiterId: user.recruiter.id,
    })

    return qb.getMany()
  }

  async findAllForCandidate(
    params: IApplicationsSearchParams,
    user_: ICurrentUser,
  ) {
    const user = await this.usersService.findFilledCandidateById(user_.id)

    const qb = this.createQB(params).andWhere("candidate.id = :candidateId", {
      candidateId: user.candidate.id,
    })

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
          type: ApplicationType.Response,
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

    return this.findOne({ id: applicationId })
  }
}
