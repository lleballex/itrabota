import { BaseEntity } from "./base-entity"

export interface Attachment extends BaseEntity {
  name: string
  mimeType: string
  size: number
}
