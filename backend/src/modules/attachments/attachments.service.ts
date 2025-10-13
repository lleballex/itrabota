import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

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

  findOneByIdWithContent(id: string) {
    return this.findOne({ id }, { selectContent: true })
  }
}
