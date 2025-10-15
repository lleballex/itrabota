import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm"
import { WithRequired } from "@/common/types/with-required.type"

import { Attachment } from "./entities/attachment.entity"

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentsRepo: Repository<Attachment>,
  ) {}

  private createQueryBuilder() {
    return this.attachmentsRepo.createQueryBuilder("attachment")
  }

  private async findOne(
    where: FindOptionsWhere<Attachment>,
    options?: { selectContent?: boolean },
  ) {
    const qb = this.createQueryBuilder().setFindOptions({ where })

    if (options?.selectContent) {
      qb.addSelect("attachment.content")
    }

    const attachment = await qb.getOne()

    if (!attachment) {
      throw new NotFoundException("Attachment not found")
    }

    return attachment
  }

  findOneById(id: string) {
    return this.findOne({ id })
  }

  async findOneByIdWithContent(id: string) {
    const attachment = await this.findOne({ id }, { selectContent: true })

    return attachment as WithRequired<typeof attachment, "content">
  }

  async create(data: DeepPartial<Attachment>) {
    const attachment = this.attachmentsRepo.create(data)
    const savedAttachment = await this.attachmentsRepo.save(attachment)

    return this.findOneById(savedAttachment.id)
  }
}
