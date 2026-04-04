import {
  ApplicationStatus,
  ApplicationType,
} from "../entities/application.entity"

export interface IApplicationsSearchParams {
  vacancyId?: string
  query?: string
  type?: ApplicationType
  status?: ApplicationStatus
}
