import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, EntityManager, Repository } from "typeorm"

import { ApplicationMessage } from "./entities/application-message.entity"

@Injectable()
export class ApplicationMessagesService {
  constructor(
    @InjectRepository(ApplicationMessage)
    private readonly messagesRepo: Repository<ApplicationMessage>,
  ) {}

  async findOneById(id: string, manager?: EntityManager) {
    const repo = manager?.getRepository(ApplicationMessage) ?? this.messagesRepo
    const message = await repo.findOne({ where: { id } })

    if (!message) {
      throw new NotFoundException("Application message not found")
    }

    return message
  }

  async create(data: DeepPartial<ApplicationMessage>, manager?: EntityManager) {
    const repo = manager?.getRepository(ApplicationMessage) ?? this.messagesRepo
    const message = await repo.save(repo.create(data))

    return this.findOneById(message.id, manager)
  }
}
