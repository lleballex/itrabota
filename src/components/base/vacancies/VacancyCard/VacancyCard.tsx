import classNames from "classnames"
import Link from "next/link"
import dayjs from "dayjs"

import {
  Vacancy,
  VacancyFormats,
  VacancySchedules,
  VacancyWorkExperiences,
} from "@/types/entities/vacancy"
import VacancyStatus from "@/components/base/vacancies/VacancyStatus"
import Avatar from "@/components/ui/Avatar"
import Separator from "@/components/ui/Separator"
import { getVacancySalary } from "@/lib/get-vacancy-salary"
import { pluralize } from "@/lib/pluralize"

interface Props {
  className?: string
  vacancy: Vacancy
  url: string
}

export default function VacancyCard({ className, vacancy, url }: Props) {
  return (
    <Link
      className={classNames(
        className,
        "group flex gap-4 pt-4 first:-mt-3 relative after:absolute after:top-0 after:-left-[var(--spacing-content)] after:-right-[var(--spacing-content)] after:bottom-0 after:-z-1 after:bg-[rgba(20,20,20)] after:opacity-0 after:transition-all hover:after:opacity-100"
      )}
      href={url}
    >
      <Avatar className="shrink-0 w-18 h-18" src={vacancy.company?.logo} />

      <div className="flex flex-col gap-2 grow pb-4 border-b border-border group-[:last-child]:border-b-0">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6 text-sm text-secondary-light">
            <p>От {dayjs(vacancy.createdAt).format("DD MMMM YYYY")}</p>
            <VacancyStatus status={vacancy.status} />
          </div>
          {vacancy.specialization && (
            <p className="text-sm border border-border rounded px-1.5 py-0.5">
              {vacancy.specialization.name}
            </p>
          )}
        </div>

        <h3 className="text-h3">{vacancy.title}</h3>

        {vacancy.company && (
          <div className="flex items-center gap-2">
            <p>{vacancy.company.name}</p>
            {vacancy.company.industry && (
              <>
                <Separator type="vertical" />
                <p>{vacancy.company.industry?.name}</p>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-6">
          <p>{VacancyWorkExperiences[vacancy.workExperience]}</p>
          <p>{VacancyFormats[vacancy.format]}</p>
          <p>{VacancySchedules[vacancy.schedule]}</p>
          <p>{getVacancySalary(vacancy)}</p>
        </div>

        {vacancy.responsesCount !== undefined && (
          <p className="text-primary">
            {vacancy.responsesCount
              ? pluralize(vacancy.responsesCount, {
                  one: "отклик",
                  few: "отклика",
                  many: "откликов",
                })
              : "Нет откликов"}
          </p>
        )}
      </div>
    </Link>
  )
}
