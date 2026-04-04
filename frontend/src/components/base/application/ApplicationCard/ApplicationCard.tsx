import { Application } from "@/types/entities/application"
import { UserRole } from "@/types/entities/user"
import VacancyCard from "@/components/base/vacancy/VacancyCard"
import CandidateCard from "@/components/base/candidate/CandidateCard"

import ApplicationCardHeader from "./ApplicationCardHeader"

interface Props {
  application: Application
  role: UserRole
  url: string
}

export default function ApplicationCard({ application, role, url }: Props) {
  if (role === UserRole.Candidate && application.vacancy) {
    return (
      <VacancyCard
        vacancy={application.vacancy}
        url={url}
        role={UserRole.Candidate}
        headerChildren={<ApplicationCardHeader application={application} />}
      />
    )
  }

  if (role === UserRole.Recruiter && application.candidate) {
    return (
      <CandidateCard
        candidate={application.candidate}
        url={url}
        headerChildren={<ApplicationCardHeader application={application} />}
        footerChildren={
          application.vacancy && <p>{application.vacancy.title}</p>
        }
      />
    )
  }
}
