import { Attachment } from "./attachment"
import { BaseEntity } from "./base-entity"
import { City } from "./city"
import { Skill } from "./skill"
import { Specialization } from "./specialization"
import { User } from "./user"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "./vacancy"
import { WorkExperienceItem } from "./work-experience-item"

export interface Candidate extends BaseEntity {
  firstName: string
  lastName: string
  patronymic: string | null
  bornAt: string
  phoneNumber: string | null
  tgUsername: string | null
  description: string | null
  isHidden: boolean
  salaryFrom: number | null
  salaryTo: number | null
  employmentType: VacancyEmploymentType | null
  format: VacancyFormat | null
  schedule: VacancySchedule | null
  city?: City | null
  specialization?: Specialization | null
  skills?: Skill[]
  workExperience?: WorkExperienceItem[]
  totalWorkExperienceMonths?: number
  matchPercent?: number
  avatar?: Attachment | null
  user?: User
}
