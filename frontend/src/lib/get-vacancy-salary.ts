import { Vacancy } from "@/types/entities/vacancy"
import { formatNumber } from "@/lib/format-number"

export const getVacancySalary = (vacancy: Vacancy) => {
  if (vacancy.salaryFrom !== null && vacancy.salaryTo !== null) {
    return `З/п от ${formatNumber(vacancy.salaryFrom, {
      format: "currency",
    })} до ${formatNumber(vacancy.salaryTo, { format: "currency" })}`
  } else if (vacancy.salaryFrom !== null) {
    return `З/п от ${formatNumber(vacancy.salaryFrom, { format: "currency" })}`
  } else if (vacancy.salaryTo !== null) {
    return `З/п до ${formatNumber(vacancy.salaryTo, { format: "currency" })}`
  } else {
    return null
  }
}
