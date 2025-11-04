import { Attachment } from "./attachment"
import { BaseEntity } from "./base-entity"
import { City } from "./city"
import { Skill } from "./skill"
import { User } from "./user"
import { WorkExperienceItem } from "./work-experience-item"

export interface Candidate extends BaseEntity {
  firstName: string
  lastName: string
  patronymic: string | null
  bornAt: string
  phoneNumber: string | null
  tgUsername: string | null
  description: string | null
  city?: City | null
  skills?: Skill[]
  workExperience?: WorkExperienceItem[]
  avatar?: Attachment | null
  user?: User
}
