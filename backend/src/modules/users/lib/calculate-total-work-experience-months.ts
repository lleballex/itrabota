interface WorkExperiencePeriod {
  startedAt: string | Date
  endedAt: string | Date | null
}

const getCompletedMonthsBetween = (startedAt: Date, endedAt: Date) => {
  let months =
    (endedAt.getFullYear() - startedAt.getFullYear()) * 12 +
    endedAt.getMonth() -
    startedAt.getMonth()

  if (endedAt.getDate() < startedAt.getDate()) {
    months -= 1
  }

  return Math.max(months, 0)
}

export const calculateTotalWorkExperienceMonths = (
  workExperience: WorkExperiencePeriod[] | undefined,
  now = new Date(),
) => {
  if (!workExperience?.length) {
    return 0
  }

  return workExperience.reduce((total, item) => {
    const startedAt = new Date(item.startedAt)
    const endedAt = item.endedAt ? new Date(item.endedAt) : now

    if (
      Number.isNaN(startedAt.getTime()) ||
      Number.isNaN(endedAt.getTime()) ||
      endedAt < startedAt
    ) {
      return total
    }

    return total + getCompletedMonthsBetween(startedAt, endedAt)
  }, 0)
}
