import { Attachment } from "./attachment"
import { BaseEntity } from "./base-entity"
import { Industry } from "./industry"

export interface Company extends BaseEntity {
  name: string
  url: string | null
  logo?: Attachment | null
  industry?: Industry
}
