import { Candidate } from "@/types/entities/candidate"
import { formatNumber } from "@/lib/format-number"

export const getCandidateSalary = (candidate: Candidate) => {
  if (candidate.salaryFrom !== null && candidate.salaryTo !== null) {
    return `От ${formatNumber(candidate.salaryFrom, {
      format: "currency",
    })} до ${formatNumber(candidate.salaryTo, { format: "currency" })}`
  } else if (candidate.salaryFrom !== null) {
    return `От ${formatNumber(candidate.salaryFrom, { format: "currency" })}`
  } else if (candidate.salaryTo !== null) {
    return `До ${formatNumber(candidate.salaryTo, { format: "currency" })}`
  } else {
    return null
  }
}
