import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

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

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,

    private readonly messagesService: ApplicationMessagesService,
    private readonly usersService: UsersService,
    private readonly vacanciesService: VacanciesService,
  ) {}

  private async findOne(where: FindOptionsWhere<Application>) {
    const application = await this.applicationsRepo.findOne({ where })

    if (!application) {
      throw new NotFoundException("Application not found")
    }

    return application
  }

  private async validateBeforeCreating(vacancy: Vacancy, candidate: Candidate) {
    try {
      await this.findOne({
        vacancy: { id: vacancy.id },
        candidate: { id: candidate.id },
      })
    } catch (e) {
      if (e instanceof NotFoundException) {
        return
      }
      throw e
    }

    throw new ConflictException("Application already exists")
  }

  async findOneById(id: string) {
    return this.findOne({ id })
  }

  async create(
    dto: CreateApplicationDto,
    vacancyId: string,
    user_: ICurrentUser,
  ) {
    const vacancy = await this.vacanciesService.findOneById(vacancyId)
    const user = await this.usersService.findFilledCandidateById(user_.id)

    await this.validateBeforeCreating(vacancy, user.candidate)

    // TODO: start transaction

    const application = await this.applicationsRepo.save(
      this.applicationsRepo.create({
        vacancy: { id: vacancy.id },
        candidate: { id: user.candidate.id },
      }),
    )

    await this.messagesService.create({
      application: { id: application.id },
      type: ApplicationMessageType.CandidateResponded,
      senderRole: UserRole.Candidate,
    })

    if (dto.message) {
      await this.messagesService.create({
        application: { id: application.id },
        type: ApplicationMessageType.UserMessage,
        senderRole: UserRole.Candidate,
        content: dto.message,
      })
    }

    return this.findOneById(application.id)
  }
}
