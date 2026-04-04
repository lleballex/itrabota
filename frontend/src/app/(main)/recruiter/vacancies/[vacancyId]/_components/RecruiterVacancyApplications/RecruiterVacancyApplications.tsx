import { useApplications } from "@/api/applications/get-applications"
import ApplicationCard from "@/components/base/application/ApplicationCard"
import RemoteData from "@/components/ui/RemoteData"
import { UserRole } from "@/types/entities/user"
import { Vacancy } from "@/types/entities/vacancy"
import { Routes } from "@/config/routes"

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
          <div className="flex flex-col">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                role={UserRole.Recruiter}
                url={Routes.recruiter.application(application.id)}
              />
            ))}
          </div>
        ) : (
          <p className="m-auto">Нет откликов</p>
        )
      }
    />
  )
}
