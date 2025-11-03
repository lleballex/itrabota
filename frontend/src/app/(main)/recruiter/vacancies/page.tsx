"use client"

import { useState } from "react"

import { useVacancies } from "@/api/vacancies/get-vacancies"
import VacancyCard from "@/components/base/vacancy/VacancyCard"
import AuthProvider from "@/components/special/AuthProvider"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { UserRole } from "@/types/entities/user"
import { VacancyStatus as IVacancyStatus } from "@/types/entities/vacancy"
import RemoteData from "@/components/ui/RemoteData"
import { Routes } from "@/config/routes"
import VacancyStatus from "@/components/base/vacancy/VacancyStatus"

const Content = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [searchStatus, setSearchStatus] = useState<IVacancyStatus | null>(null)

  const vacancies = useVacancies({
    role: UserRole.Recruiter,
    query: searchQuery ?? undefined,
    status: searchStatus ?? undefined,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1">Вакансии</h1>
        <div className="flex gap-2">
          <Input
            className="min-w-1/2"
            prefix={<Icon icon="search" />}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск"
          />
          <Select<IVacancyStatus | null>
            className="min-w-1/5"
            value={searchStatus}
            onChange={setSearchStatus}
            items={[
              {
                value: null,
                content: "Все статусы",
              },
              ...(Object.values(IVacancyStatus) as IVacancyStatus[]).map(
                (status) => ({
                  value: status,
                  content: <VacancyStatus status={status} />,
                })
              ),
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <RemoteData
          data={vacancies}
          onSuccess={(vacancies) =>
            vacancies.length
              ? vacancies.map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    url={Routes.recruiter.vacancy(vacancy.id)}
                  />
                ))
              : "Ничего не найдено"
          }
        />
      </div>

      <Button
        className="self-center mt-auto sticky bottom-3"
        type="glass"
        link={{ url: Routes.recruiter.newVacancy }}
      >
        <Icon icon="plus" />
        Создать вакансию
      </Button>
    </div>
  )
}

export default function RecruiterVacanciesPage() {
  return <AuthProvider Component={Content} roles={[UserRole.Recruiter]} />
}
