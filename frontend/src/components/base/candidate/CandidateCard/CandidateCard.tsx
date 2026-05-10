import classNames from "classnames"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

import { getProfileAvatar } from "@/lib/get-profile-avatar"
import { getCandidateSalary } from "@/lib/get-candidate-salary"
import { formatWorkExperienceMonths } from "@/lib/format-work-experience-months"
import { pluralize } from "@/lib/pluralize"
import { Candidate } from "@/types/entities/candidate"
import { UserRole } from "@/types/entities/user"
import {
  VacancyFormat,
  VacancyFormats,
  VacancySchedules,
} from "@/types/entities/vacancy"

interface Props {
  className?: string
  candidate: Candidate
  url: string
  headerChildren?: ReactNode
  footerChildren?: ReactNode
}

export default function CandidateCard({
  className,
  candidate,
  url,
  headerChildren,
  footerChildren,
}: Props) {
  const age = Math.max(dayjs().diff(candidate.bornAt, "year"), 0)
  const candidateSalary = getCandidateSalary(candidate)
  const workExperience = formatWorkExperienceMonths(
    candidate.totalWorkExperienceMonths ?? 0,
  )
  const candidateInfo = [
    workExperience === "Без опыта" ? workExperience : `Опыт ${workExperience}`,
    candidate.format
      ? `${VacancyFormats[candidate.format]} ${
          candidate.format !== VacancyFormat.Remote && candidate.city
            ? `(${candidate.city.name})`
            : ""
        }`
      : null,
    candidate.schedule ? VacancySchedules[candidate.schedule] : null,
    candidateSalary ? `З/п ${candidateSalary.toLowerCase()}` : null,
  ].filter((item): item is string => Boolean(item))
  const projectsCount = candidate.projects?.length ?? 0
  const projectsLabel = pluralize(projectsCount, {
    one: "проект",
    few: "проекта",
    many: "проектов",
  })

  return (
    <Link
      className={classNames(
        className,
        "group flex gap-4 pt-4 first:-mt-3 relative after:absolute after:top-0 after:-left-[var(--spacing-content)] after:-right-[var(--spacing-content)] after:bottom-0 after:-z-1 after:bg-[rgba(20,20,20)] after:opacity-0 after:transition-all hover:after:opacity-100",
      )}
      href={url}
    >
      <Image
        className="shrink-0 w-18 h-18 rounded-full object-contain"
        src={getProfileAvatar({ profile: candidate, role: UserRole.Candidate })}
        width={300}
        height={300}
        alt=""
      />

      <div className="flex flex-col gap-2 grow pb-4 min-h-[calc(var(--spacing)*22)] border-b border-border group-[:last-child]:border-b-0">
        {headerChildren && (
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-6 text-sm text-secondary-light">
              {headerChildren}
            </div>
            {candidate.specialization && (
              <p className="text-sm border border-border rounded px-1.5 py-0.5">
                {candidate.specialization.name}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-h3">
            {candidate.lastName} {candidate.firstName}
            <span className="text-base font-normal text-secondary-light">
              , {pluralize(age, { one: "год", few: "года", many: "лет" })}
            </span>
          </h3>
          {!headerChildren && candidate.specialization && (
            <p className="text-sm border border-border rounded px-1.5 py-0.5">
              {candidate.specialization.name}
            </p>
          )}
        </div>

        {!!candidateInfo.length && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {candidateInfo.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <p>{projectsLabel}</p>
        </div>

        {!!candidate.skills?.length && (
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill) => (
              <span
                className="px-1.5 py-0.5 text-sm border border-border rounded"
                key={skill.id}
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {footerChildren}
      </div>
    </Link>
  )
}
