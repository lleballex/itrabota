"use client"

import { useParams } from "next/navigation"
import Image from "next/image"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import { useVacancy } from "@/api/vacancies/get-vacancy"
import RemoteData from "@/components/ui/RemoteData"
import { getVacancySalary } from "@/lib/get-vacancy-salary"
import {
  VacancyEmploymentTypes,
  VacancyFormats,
  VacancySchedules,
  VacancyStatus,
  VacancyWorkExperiences,
} from "@/types/entities/vacancy"
import Separator from "@/components/ui/Separator"
import Button from "@/components/ui/Button"

import VacancyItem from "./_components/VacancyItem/VacancyItem"
import Icon from "@/components/ui/Icon"
import { getCompanyLogo } from "@/lib/get-company-logo"
import { Routes } from "@/config/routes"

const Content = () => {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const vacancy = useVacancy({ id: vacancyId })

  return (
    <RemoteData
      data={vacancy}
      onSuccess={(vacancy) => (
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 items-center">
            <Image
              className="shrink-0 w-20 h-20 rounded-full"
              src={getCompanyLogo(vacancy.recruiter?.company)}
              width={300}
              height={300}
              alt=""
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-h1">{vacancy.title}</h1>
              {vacancy.recruiter?.company && (
                <div className="flex items-center gap-2">
                  <p>{vacancy.recruiter.company.name}</p>
                  {vacancy.recruiter.company.industry && (
                    <>
                      <Separator className="!h-[1em]" type="vertical" />
                      <p>{vacancy.recruiter.company.industry?.name}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <VacancyItem
                label="З/п"
                content={getVacancySalary(vacancy) ?? "Не указано"}
              />
              <VacancyItem
                label="Формат работы"
                content={VacancyFormats[vacancy.format]}
              />
              <VacancyItem
                label="График работы"
                content={VacancySchedules[vacancy.schedule]}
              />
            </div>
            <div className="flex gap-3">
              <VacancyItem
                label="Тип занятости"
                content={VacancyEmploymentTypes[vacancy.employmentType]}
              />
              <VacancyItem
                label="Опыт работы"
                content={VacancyWorkExperiences[vacancy.workExperience]}
              />
              {vacancy.specialization && (
                <VacancyItem
                  label="Направление"
                  content={vacancy.specialization.name}
                />
              )}
            </div>
          </div>

          {!!vacancy.skills?.length && (
            <div className="flex flex-col gap-1.5">
              <p className="text-h5">Ключевые навыки</p>
              <div className="flex flex-wrap gap-1.5">
                {vacancy.skills.map((skill) => (
                  <span
                    className="px-1.5 py-0.5 border border-border rounded"
                    key={skill.id}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vacancy.description && (
            <div className="flex flex-col gap-1.5">
              <p className="text-h5">Описание</p>
              <p>{vacancy.description}</p>
            </div>
          )}

          {(vacancy.requirements ||
            vacancy.conditions ||
            vacancy.responsibilities ||
            vacancy.niceToHave) && (
            <div className="flex gap-5">
              {(vacancy.requirements || vacancy.conditions) && (
                <div className="flex flex-col gap-5 w-full">
                  {vacancy.requirements && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-h5">Требования</p>
                      <p>{vacancy.requirements}</p>
                    </div>
                  )}
                  {vacancy.conditions && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-h5">Условия</p>
                      <p>{vacancy.conditions}</p>
                    </div>
                  )}
                </div>
              )}
              {(vacancy.responsibilities || vacancy.niceToHave) && (
                <div className="flex flex-col gap-5 w-full">
                  {vacancy.responsibilities && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-h5">Обязанности</p>
                      <p>{vacancy.responsibilities}</p>
                    </div>
                  )}
                  {vacancy.niceToHave && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-h5">Будет плюсом</p>
                      <p>{vacancy.niceToHave}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex self-center items-center gap-2 sticky bottom-[var(--spacing-screen)]">
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
          </div>
        </div>
      )}
    />
  )
}

export default function RecruiterVacancyPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
