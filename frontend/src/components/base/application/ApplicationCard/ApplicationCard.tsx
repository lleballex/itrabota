import { Application } from "@/types/entities/application"
import ApplicationChat from "@/components/base/application/ApplicationChat"
import { Vacancy } from "@/types/entities/vacancy"
import { UserRole } from "@/types/entities/user"

interface Props {
  application: Application
  vacancy: Vacancy
}

// TODO: now it's for recruiter

export default function ApplicationCard({ application, vacancy }: Props) {
  return (
    <ApplicationChat
      role={UserRole.Recruiter}
      application={application}
      vacancy={vacancy}
    />
  )
}
