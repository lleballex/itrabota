"use client"

import { useParams } from "next/navigation"

import { useVacancy } from "@/api/vacancies/get-vacancy"
import VacancyForm from "@/components/base/vacancy/VacancyForm"
import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import RemoteData from "@/components/ui/RemoteData"

const Content = () => {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const vacancy = useVacancy({ id: vacancyId })

  return (
    <RemoteData
      data={vacancy}
      onSuccess={(vacancy) => <VacancyForm vacancy={vacancy} />}
    />
  )
}

export default function RecruiterEditVacancyPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
