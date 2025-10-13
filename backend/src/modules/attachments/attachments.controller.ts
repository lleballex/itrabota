import { Controller, Get, Param, Res, StreamableFile } from "@nestjs/common"
import { Response } from "express"

import { AttachmentsService } from "./attachments.service"

@Controller("attachments")
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get(":id/content")
  async getContent(
    @Param("id") id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const attachment = await this.attachmentsService.findOneByIdWithContent(id)

    res.setHeader("Content-Type", attachment.mimeType)
    res.setHeader("Content-Length", attachment.size.toString())

    return new StreamableFile(attachment.content)
  }
}
