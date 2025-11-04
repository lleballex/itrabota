"use client"

import { useState } from "react"

import { useVacancies } from "@/api/vacancies/get-vacancies"
import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import Input from "@/components/ui/Input"
import Icon from "@/components/ui/Icon"
import RemoteData from "@/components/ui/RemoteData"
import VacancyCard from "@/components/base/vacancy/VacancyCard"
import { Routes } from "@/config/routes"

const Content = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  const vacancies = useVacancies({
    role: UserRole.Candidate,
    query: searchQuery ?? undefined,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1">Вакансии</h1>
        <Input
          prefix={<Icon icon="search" />}
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск"
        />
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
                    url={Routes.candidate.vacancy(vacancy.id)}
                    role={UserRole.Candidate}
                  />
                ))
              : "Ничего не найдено"
          }
        />
      </div>
    </div>
  )
}

export default function CandidateVacanciesPage() {
  return <AuthProvider roles={[UserRole.Candidate]} Component={Content} />
}
