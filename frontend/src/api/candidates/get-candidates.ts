import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import { Candidate } from "@/types/entities/candidate"
import { UserRole } from "@/types/entities/user"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
} from "@/types/entities/vacancy"

interface RecruiterParams {
  role: typeof UserRole.Recruiter
  query?: string
  employmentTypes?: VacancyEmploymentType[]
  formats?: VacancyFormat[]
  schedules?: VacancySchedule[]
  specializationIds?: string[]
  cityIds?: string[]
  skillIds?: string[]
  salaryFrom?: number
  salaryTo?: number
  totalWorkExperienceMonthsMin?: number
  projectsCountMin?: number
  ageFrom?: number
  ageTo?: number
}

// TODO: only for recruiter now
export const useCandidates = createUseQuery(
  "candidates",
  async ({ role, ...params }: RecruiterParams) => {
    const url = {
      [UserRole.Recruiter]: "/candidates/recruiter",
    }[role]

    const res = await axios.get<Candidate[]>(url, { params })

    return res.data
  },
)
