"use client"

import { useParams } from "next/navigation"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import VacancyDetailed from "@/components/base/vacancy/VacancyDetailed"
import { useVacancy } from "@/api/vacancies/get-vacancy"
import RemoteData from "@/components/ui/RemoteData"
import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"
import Icon from "@/components/ui/Icon"
import { VacancyStatus } from "@/types/entities/vacancy"

const Content = () => {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const vacancy = useVacancy({ id: vacancyId })

  return (
    <RemoteData
      data={vacancy}
      onSuccess={(vacancy) => (
        <VacancyDetailed
          vacancy={vacancy}
          controls={
            <>
              <Button
                type="glass"
                link={{ url: Routes.recruiter.editVacancy(vacancy.id) }}
              >
                <Icon icon="pen" />
                Изменить
              </Button>
              {vacancy.status === VacancyStatus.Active && (
                <Button type="glass">
                  <Icon icon="archive" />В архив
                </Button>
              )}
              {vacancy.status === VacancyStatus.Archived && (
                <Button type="glass">
                  <Icon icon="archiveRestore" />
                  Вернуть из архива
                </Button>
              )}
            </>
          }
        />
      )}
    />
  )
}

export default function RecruiterVacancyPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
