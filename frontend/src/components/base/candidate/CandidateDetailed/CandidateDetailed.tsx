"use client"

import dayjs from "dayjs"
import Image from "next/image"
import { Fragment, useState } from "react"

import { Candidate } from "@/types/entities/candidate"
import { getProfileAvatar } from "@/lib/get-profile-avatar"
import { UserRole } from "@/types/entities/user"
import Separator from "@/components/ui/Separator"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import {
  VacancyEmploymentTypes,
  VacancyFormats,
  VacancySchedules,
} from "@/types/entities/vacancy"
import { getCandidateSalary } from "@/lib/get-candidate-salary"
import { formatWorkExperienceMonths } from "@/lib/format-work-experience-months"
import { pluralize } from "@/lib/pluralize"

import CandidateDetailedItem from "./CandidateDetailedItem"
import InviteCandidateModal from "./InviteCandidateModal"
import CandidateApplicationsHistory from "./CandidateApplicationsHistory"

interface Props {
  candidate: Candidate
  role: UserRole
  withInviteAction?: boolean
}

interface ContactItem {
  icon: "mail" | "phone" | "telegram"
  content: string
  href: string
}

export default function CandidateDetailed({
  candidate,
  role,
  withInviteAction = role === UserRole.Recruiter,
}: Props) {
  const [isInviteModalActive, setIsInviteModalActive] = useState(false)
  const age = Math.max(dayjs().diff(candidate.bornAt, "year"), 0)
  const headerItems: string[] = [
    pluralize(age, { one: "год", few: "года", many: "лет" }),
    candidate.city?.name,
  ].filter((item): item is string => Boolean(item))
  const contactItems: ContactItem[] = []

  if (candidate.user?.email) {
    contactItems.push({
      icon: "mail",
      content: candidate.user.email,
      href: `mailto:${candidate.user.email}`,
    })
  }

  if (candidate.phoneNumber) {
    contactItems.push({
      icon: "phone",
      content: candidate.phoneNumber,
      href: `tel:${candidate.phoneNumber}`,
    })
  }

  if (candidate.tgUsername) {
    contactItems.push({
      icon: "telegram",
      content: candidate.tgUsername.startsWith("@")
        ? candidate.tgUsername
        : `@${candidate.tgUsername}`,
      href: `https://t.me/${candidate.tgUsername.replace(/^@/, "")}`,
    })
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center">
          <Image
            className="shrink-0 w-20 h-20 rounded-full"
            src={getProfileAvatar({
              profile: candidate,
              role: UserRole.Candidate,
            })}
            width={300}
            height={300}
            alt=""
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-h1">
              {candidate.lastName} {candidate.firstName}
            </h1>
            {!!headerItems.length && (
              <div className="flex items-center gap-2 flex-wrap">
                {headerItems.map((item, idx) => (
                  <Fragment key={item}>
                    {idx > 0 && (
                      <Separator className="!h-[1em]" type="vertical" />
                    )}
                    <p>{item}</p>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <CandidateDetailedItem
              label="Желаемая з/п"
              content={getCandidateSalary(candidate) ?? "Не указано"}
            />
            <CandidateDetailedItem
              label="Желаемый формат работы"
              content={
                candidate.format
                  ? VacancyFormats[candidate.format]
                  : "Не указано"
              }
            />
            <CandidateDetailedItem
              label="Желаемый график работы"
              content={
                candidate.schedule
                  ? VacancySchedules[candidate.schedule]
                  : "Не указано"
              }
            />
          </div>
          <div className="flex gap-3">
            <CandidateDetailedItem
              label="Желаемый тип занятости"
              content={
                candidate.employmentType
                  ? VacancyEmploymentTypes[candidate.employmentType]
                  : "Не указано"
              }
            />
            <CandidateDetailedItem
              label="Опыт работы"
              content={formatWorkExperienceMonths(
                candidate.totalWorkExperienceMonths ?? 0,
              )}
            />
            <CandidateDetailedItem
              label="Направление"
              content={candidate.specialization?.name ?? "Не указано"}
            />
          </div>
        </div>

        {!!contactItems.length && (
          <div className="flex flex-col gap-1.5">
            <p className="text-h5">Контакты</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {contactItems.map((item) => (
                <a
                  className="flex items-center gap-1 text-secondary-light transition-colors hover:text-primary"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="shrink-0" icon={item.icon} />
                  <span>{item.content}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {!!candidate.skills?.length && (
          <div className="flex flex-col gap-1.5">
            <p className="text-h5">Ключевые навыки</p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
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

        {candidate.description && (
          <div className="flex flex-col gap-1.5">
            <p className="text-h5">О соискателе</p>
            <p>{candidate.description}</p>
          </div>
        )}

        {!!candidate.workExperience?.length && (
          <div className="flex flex-col gap-3">
            <p className="text-h5">Опыт работы</p>
            {candidate.workExperience.map((item) => (
              <div className="flex flex-col gap-1.5" key={item.id}>
                <p>
                  <span className="font-semibold">{item.position}</span> в{" "}
                  {item.companyName}
                </p>
                <p className="text-secondary-light">
                  {dayjs(item.startedAt).format("MM.YYYY")} -{" "}
                  {item.endedAt
                    ? dayjs(item.endedAt).format("MM.YYYY")
                    : "н.в."}
                </p>
                {item.description && <p>{item.description}</p>}
              </div>
            ))}
          </div>
        )}

        {role === UserRole.Recruiter && (
          <CandidateApplicationsHistory candidateId={candidate.id} />
        )}

        {withInviteAction && (
          <div className="flex self-center items-center gap-2 sticky bottom-[var(--spacing-screen)]">
            <Button type="glass" onClick={() => setIsInviteModalActive(true)}>
              Пригласить на вакансию
            </Button>
          </div>
        )}
      </div>

      {withInviteAction && (
        <InviteCandidateModal
          candidate={candidate}
          active={isInviteModalActive}
          onActiveChange={setIsInviteModalActive}
        />
      )}
    </>
  )
}
