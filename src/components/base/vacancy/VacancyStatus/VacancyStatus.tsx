import classNames from "classnames"

import {
  VacancyStatus as TVacancyStatus,
  VacancyStatuses,
} from "@/types/entities/vacancy"

interface Props {
  className?: string
  status: TVacancyStatus
}

export default function VacancyStatus({ className, status }: Props) {
  return (
    <div className={classNames(className, "flex items-center gap-1")}>
      <span
        className={classNames("w-1 h-1 rounded-full", {
          "bg-danger": status === TVacancyStatus.Active,
          "bg-secondary": status === TVacancyStatus.Archived,
        })}
      />
      <p>{VacancyStatuses[status]}</p>
    </div>
  )
}
