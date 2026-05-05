import { pluralize } from "@/lib/pluralize"

export const formatWorkExperienceMonths = (months: number) => {
  if (months <= 0) {
    return "Без опыта"
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts: string[] = []

  if (years > 0) {
    parts.push(
      pluralize(years, {
        one: "год",
        few: "года",
        many: "лет",
      }),
    )
  }

  if (remainingMonths > 0) {
    parts.push(
      pluralize(remainingMonths, {
        one: "месяц",
        few: "месяца",
        many: "месяцев",
      }),
    )
  }

  return parts.join(" ")
}
