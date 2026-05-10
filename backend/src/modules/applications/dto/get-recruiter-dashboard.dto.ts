import { Transform } from "class-transformer"
import { IsBoolean, IsIn, IsOptional } from "class-validator"

export const RecruiterDashboardPeriods = [
  "day",
  "week",
  "month",
  "year",
] as const

export type RecruiterDashboardPeriod =
  (typeof RecruiterDashboardPeriods)[number]

export class GetRecruiterDashboardDto {
  @IsIn(RecruiterDashboardPeriods)
  @IsOptional()
  period?: RecruiterDashboardPeriod

  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  @IsOptional()
  includeInvitations?: boolean
}
