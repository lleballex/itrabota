import { ReactNode } from "react"
import Image from "next/image"

import {
  Vacancy,
  VacancyEmploymentTypes,
  VacancyFormats,
  VacancySchedules,
  VacancyWorkExperiences,
} from "@/types/entities/vacancy"
import { getCompanyLogo } from "@/lib/get-company-logo"
import Separator from "@/components/ui/Separator"
import { getVacancySalary } from "@/lib/get-vacancy-salary"

import VacancyDetailedItem from "./VacancyDetailedItem"

interface Props {
  vacancy: Vacancy
  controls?: ReactNode
}

export default function VacancyDetailed({ vacancy, controls }: Props) {
  return (
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
          <VacancyDetailedItem
            label="З/п"
            content={getVacancySalary(vacancy) ?? "Не указано"}
          />
          <VacancyDetailedItem
            label="Формат работы"
            content={VacancyFormats[vacancy.format]}
          />
          <VacancyDetailedItem
            label="График работы"
            content={VacancySchedules[vacancy.schedule]}
          />
        </div>
        <div className="flex gap-3">
          <VacancyDetailedItem
            label="Тип занятости"
            content={VacancyEmploymentTypes[vacancy.employmentType]}
          />
          <VacancyDetailedItem
            label="Опыт работы"
            content={VacancyWorkExperiences[vacancy.workExperience]}
          />
          {vacancy.specialization && (
            <VacancyDetailedItem
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

      {controls && (
        <div className="flex self-center items-center gap-2 sticky bottom-[var(--spacing-screen)]">
          {controls}
        </div>
      )}
    </div>
  )
}
