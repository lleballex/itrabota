interface AttachmentLike {
  id: string
}

export const getAttachmentUrl = (attachment: AttachmentLike) => {
  return process.env.NEXT_PUBLIC_ATTACHMENT_URL.replace(":id", attachment.id)
}
