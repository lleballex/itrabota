import classNames from "classnames"

import {
  ApplicationStatus as IApplicationStatus,
  ApplicationStatuses,
} from "@/types/entities/application"

interface Props {
  className?: string
  status: IApplicationStatus
}

export default function ApplicationStatus({ className, status }: Props) {
  return (
    <div className={classNames(className, "flex items-center gap-1")}>
      <span
        className={classNames("w-1 h-1 rounded-full", {
          "bg-primary": status === IApplicationStatus.Pending,
          "bg-success": status === IApplicationStatus.Approved,
          "bg-danger": status === IApplicationStatus.Rejected,
        })}
      />
      <p>{ApplicationStatuses[status]}</p>
    </div>
  )
}
