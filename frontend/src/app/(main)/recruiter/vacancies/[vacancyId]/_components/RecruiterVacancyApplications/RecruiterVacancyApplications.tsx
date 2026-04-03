import { useApplications } from "@/api/applications/get-applications"
import ApplicationCard from "@/components/base/application/ApplicationCard"
import RemoteData from "@/components/ui/RemoteData"
import Separator from "@/components/ui/Separator"
import { UserRole } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"
import { Fragment } from "react"

interface Props {
  vacancy: Vacancy
}

export default function RecruiterVacancyApplications({ vacancy }: Props) {
  const applications = useApplications({
    role: UserRole.Recruiter,
    vacancyId: vacancy.id,
  })

  return (
    <RemoteData
      data={applications}
      onSuccess={(applications) =>
        applications.length ? (
          <div className="flex flex-col gap-6">
            {applications.map((application) => (
              <Fragment key={application.id}>
                <ApplicationCard application={application} vacancy={vacancy} />
                <Separator className="last:hidden" type="horizontal" />
              </Fragment>
            ))}
          </div>
        ) : (
          <p className="m-auto">Нет откликов</p>
        )
      }
    />
  )
}
