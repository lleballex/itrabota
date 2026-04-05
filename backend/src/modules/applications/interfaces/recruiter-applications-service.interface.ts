import {
  ApplicationStatus,
  ApplicationType,
} from "../entities/application.entity"

export interface IRecruiterApplicationsSearchParams {
  vacancyId?: string
  query?: string
  type?: ApplicationType
  status?: ApplicationStatus
}
