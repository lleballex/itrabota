"use client"

import { useParams } from "next/navigation"

import { useVacancy } from "@/api/vacancies/get-vacancy"
import VacancyForm from "@/components/base/vacancy/VacancyForm"
import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import RemoteData from "@/components/ui/RemoteData"
import { useApplications } from "@/api/applications/get-applications"

const Content = () => {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const vacancy = useVacancy({ id: vacancyId })
  const applications = useApplications({
    role: UserRole.Recruiter,
    vacancyId,
  })

  return (
    <RemoteData
      data={vacancy}
      onSuccess={(vacancy) => (
        <RemoteData
          data={applications}
          onSuccess={(applications) => (
            <VacancyForm
              vacancy={vacancy}
              hasApplications={applications.length > 0}
            />
          )}
        />
      )}
    />
  )
}

export default function RecruiterEditVacancyPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
