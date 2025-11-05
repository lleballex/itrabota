import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, Repository } from "typeorm"

import { ApplicationMessage } from "./entities/application-message.entity"

@Injectable()
export class ApplicationMessagesService {
  constructor(
    @InjectRepository(ApplicationMessage)
    private readonly messagesRepo: Repository<ApplicationMessage>,
  ) {}

  async findOneById(id: string) {
    const message = await this.messagesRepo.findOne({ where: { id } })

    if (!message) {
      throw new NotFoundException("Application message not found")
    }

    return message
  }

  async create(data: DeepPartial<ApplicationMessage>) {
    const message = await this.messagesRepo.save(this.messagesRepo.create(data))

    return this.findOneById(message.id)
  }
}
