import { Attachment } from "@/types/entities/attachment"

export const getAttachmentUrl = (attachment: Attachment) => {
  return `http://localhost:8000/api/attachments/${attachment.id}/content` // TODO: to config
}
