export const RecruiterDashboardPeriod = {
  Day: "day",
  Week: "week",
  Month: "month",
  Year: "year",
} as const

export type RecruiterDashboardPeriod =
  (typeof RecruiterDashboardPeriod)[keyof typeof RecruiterDashboardPeriod]

export interface RecruiterDashboardMetric {
  value: number
  previousValue: number
  delta: number
  deltaPercent: number | null
  trend: "up" | "down" | "flat"
}

export interface RecruiterDashboardTimelineBucket {
  bucketStart: string
  responses: number
  accepted: number
  rejected: number
}

export interface RecruiterDashboardTopVacancy {
  vacancyId: string
  title: string
  responses: number
  accepted: number
  rejected: number
  pending: number
  conversionPercent: number
}

export interface RecruiterDashboardStats {
  period: {
    key: RecruiterDashboardPeriod
    currentStart: string
    currentEnd: string
    previousStart: string
    previousEnd: string
    includeInvitations: boolean
  }
  summary: {
    responses: RecruiterDashboardMetric
    accepted: RecruiterDashboardMetric
    rejected: RecruiterDashboardMetric
    pendingCurrent: {
      value: number
    }
  }
  timeline: RecruiterDashboardTimelineBucket[]
  topVacancies: RecruiterDashboardTopVacancy[]
}
