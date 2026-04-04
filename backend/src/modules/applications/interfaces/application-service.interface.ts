import { Candidate } from "@/modules/users/entities/candidate.entity"
import {
  ApplicationStatus,
  ApplicationType,
} from "../entities/application.entity"
import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { ApplicationMessageType } from "../entities/application-message.entity"
import { UserRole } from "@/modules/users/types/user-role"

export interface IApplicationsSearchParams {
  vacancyId?: string
  query?: string
  type?: ApplicationType
  status?: ApplicationStatus
}

export interface IApplicationCreateData {
  candidate: Candidate
  vacancy: Vacancy
  type: ApplicationType
  senderRole: UserRole
  systemMessageType: ApplicationMessageType
  userMessage?: string | null
}
