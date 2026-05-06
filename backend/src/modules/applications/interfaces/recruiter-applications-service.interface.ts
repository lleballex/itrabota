import {
  ApplicationStatus,
  ApplicationType,
} from "../entities/application.entity"

export interface IRecruiterApplicationsSearchParams {
  vacancyId?: string
  candidateId?: string
  query?: string
  type?: ApplicationType
  status?: ApplicationStatus
}
