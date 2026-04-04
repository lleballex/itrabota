"use client"

import dayjs from "dayjs"
import Image from "next/image"
import { useState } from "react"

import { Candidate } from "@/types/entities/candidate"
import { getProfileAvatar } from "@/lib/get-profile-avatar"
import { UserRole } from "@/types/entities/user"
import Separator from "@/components/ui/Separator"
import Button from "@/components/ui/Button"

import CandidateDetailedItem from "./CandidateDetailedItem"
import InviteCandidateModal from "./InviteCandidateModal"

interface Props {
  candidate: Candidate
  role: UserRole
}

export default function CandidateDetailed({ candidate, role }: Props) {
  const [isInviteModalActive, setIsInviteModalActive] = useState(false)

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
            {(candidate.city ||
              candidate.phoneNumber ||
              candidate.tgUsername) && (
              <div className="flex items-center gap-2 flex-wrap">
                {candidate.city && <p>{candidate.city.name}</p>}
                {candidate.phoneNumber && (
                  <>
                    <Separator className="!h-[1em]" type="vertical" />
                    <p>{candidate.phoneNumber}</p>
                  </>
                )}
                {candidate.tgUsername && (
                  <>
                    <Separator className="!h-[1em]" type="vertical" />
                    <p>@{candidate.tgUsername}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <CandidateDetailedItem
            label="Имя"
            content={`${candidate.lastName} ${candidate.firstName}`}
          />
          <CandidateDetailedItem
            label="Дата рождения"
            content={dayjs(candidate.bornAt).format("DD.MM.YYYY")}
          />
        </div>

        {candidate.description && (
          <div className="flex flex-col gap-1.5">
            <p className="text-h5">О кандидате</p>
            <p>{candidate.description}</p>
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
          <div className="flex self-center items-center gap-2 sticky bottom-[var(--spacing-screen)]">
            <Button type="glass" onClick={() => setIsInviteModalActive(true)}>
              Пригласить на вакансию
            </Button>
          </div>
        )}
      </div>

      <InviteCandidateModal
        candidate={candidate}
        active={isInviteModalActive}
        onActiveChange={setIsInviteModalActive}
      />
    </>
  )
}
