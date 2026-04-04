import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm"
import { WithRequired } from "@/common/types/with-required.type"

import { Attachment } from "./entities/attachment.entity"

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentsRepo: Repository<Attachment>,
  ) {}

  private createQueryBuilder(manager?: EntityManager) {
    const repo = manager?.getRepository(Attachment) ?? this.attachmentsRepo

    return repo.createQueryBuilder("attachment")
  }

  private async findOne(
    where: FindOptionsWhere<Attachment>,
    options?: { selectContent?: boolean; manager?: EntityManager },
  ) {
    const qb = this.createQueryBuilder(options?.manager).setFindOptions({
      where,
    })

    if (options?.selectContent) {
      qb.addSelect("attachment.content")
    }

    const attachment = await qb.getOne()

    if (!attachment) {
      throw new NotFoundException("Attachment not found")
    }

    return attachment
  }

  findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, { manager })
  }

  async findOneByIdWithContent(id: string, manager?: EntityManager) {
    const attachment = await this.findOne(
      { id },
      { selectContent: true, manager },
    )

    return attachment as WithRequired<typeof attachment, "content">
  }

  async create(data: DeepPartial<Attachment>, manager?: EntityManager) {
    const repo = manager?.getRepository(Attachment) ?? this.attachmentsRepo

    const attachment = repo.create(data)
    const savedAttachment = await repo.save(attachment)

    return this.findOneById(savedAttachment.id, manager)
  }

  async delete(id: string, manager?: EntityManager) {
    const repo = manager?.getRepository(Attachment) ?? this.attachmentsRepo
    const attachment = await this.findOneById(id, manager)

    await repo.remove(attachment)
  }
}
