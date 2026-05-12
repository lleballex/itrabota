import {
  Vacancy,
  VacancyFormat,
  VacancyWorkExperience,
} from "../entities/vacancy.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { MATCH_PERCENT_WEIGHTS } from "./matching"

function hasSkillOverlap(
  requiredSkillIds: string[],
  availableSkillIds: string[],
) {
  const availableSet = new Set(availableSkillIds)

  return requiredSkillIds.filter((skillId) => availableSet.has(skillId)).length
}

function calculateSkillScore(vacancy: Vacancy, candidate: Candidate) {
  const requiredSkillIds = vacancy.skills?.map((skill) => skill.id) ?? []

  if (!requiredSkillIds.length) {
    return MATCH_PERCENT_WEIGHTS.skills
  }

  const availableSkillIds = candidate.skills?.map((skill) => skill.id) ?? []
  const matchedSkillsCount = hasSkillOverlap(
    requiredSkillIds,
    availableSkillIds,
  )

  return Math.min(
    MATCH_PERCENT_WEIGHTS.skills,
    (matchedSkillsCount * MATCH_PERCENT_WEIGHTS.skills) /
      requiredSkillIds.length,
  )
}

function calculateExperienceScore(vacancy: Vacancy, candidate: Candidate) {
  const candidateExperienceMonths = candidate.totalWorkExperienceMonths ?? 0

  switch (vacancy.workExperience) {
    case VacancyWorkExperience.None:
      return MATCH_PERCENT_WEIGHTS.experience
    case VacancyWorkExperience.UpToYear:
      return candidateExperienceMonths > 0
        ? MATCH_PERCENT_WEIGHTS.experience
        : 0
    case VacancyWorkExperience.OneToThreeYears:
      return candidateExperienceMonths >= 12
        ? MATCH_PERCENT_WEIGHTS.experience
        : 0
    case VacancyWorkExperience.ThreeToFiveYears:
      return candidateExperienceMonths >= 36
        ? MATCH_PERCENT_WEIGHTS.experience
        : 0
    case VacancyWorkExperience.FromFiveYears:
      return candidateExperienceMonths >= 60
        ? MATCH_PERCENT_WEIGHTS.experience
        : 0
    default:
      return MATCH_PERCENT_WEIGHTS.experience
  }
}

export function calculateMatchPercent(vacancy: Vacancy, candidate: Candidate) {
  let score = 0

  score += calculateSkillScore(vacancy, candidate)

  score += vacancy.specialization?.id
    ? vacancy.specialization.id === candidate.specialization?.id
      ? MATCH_PERCENT_WEIGHTS.specialization
      : 0
    : MATCH_PERCENT_WEIGHTS.specialization

  score += calculateExperienceScore(vacancy, candidate)

  score +=
    vacancy.salaryFrom == null && vacancy.salaryTo == null
      ? MATCH_PERCENT_WEIGHTS.salary
      : (vacancy.salaryTo == null ||
            (candidate.salaryFrom ?? 0) <= vacancy.salaryTo) &&
          (vacancy.salaryFrom == null ||
            (candidate.salaryTo ?? Number.MAX_SAFE_INTEGER) >=
              vacancy.salaryFrom)
        ? MATCH_PERCENT_WEIGHTS.salary
        : 0

  score += vacancy.format
    ? vacancy.format === candidate.format
      ? MATCH_PERCENT_WEIGHTS.format
      : 0
    : MATCH_PERCENT_WEIGHTS.format

  score +=
    vacancy.format === VacancyFormat.Remote || !vacancy.city?.id
      ? MATCH_PERCENT_WEIGHTS.city
      : vacancy.city.id === candidate.city?.id
        ? MATCH_PERCENT_WEIGHTS.city
        : 0

  score += vacancy.employmentType
    ? vacancy.employmentType === candidate.employmentType
      ? MATCH_PERCENT_WEIGHTS.employmentType
      : 0
    : MATCH_PERCENT_WEIGHTS.employmentType

  score += vacancy.schedule
    ? vacancy.schedule === candidate.schedule
      ? MATCH_PERCENT_WEIGHTS.schedule
      : 0
    : MATCH_PERCENT_WEIGHTS.schedule

  return Math.round(score)
}
