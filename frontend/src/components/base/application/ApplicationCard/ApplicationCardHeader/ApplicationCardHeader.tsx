import dayjs from "dayjs"

import { Application } from "@/types/entities/application"
import ApplicationStatus from "@/components/base/application/ApplicationStatus"

interface Props {
  application: Application
}

export default function ApplicationCardHeader({ application }: Props) {
  return (
    <>
      <p>От {dayjs(application.createdAt).format("DD MMMM YYYY")}</p>
      <ApplicationStatus status={application.status} />
    </>
  )
}
