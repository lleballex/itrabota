import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

import { getProfileAvatar } from "@/lib/get-profile-avatar"
import { Candidate } from "@/types/entities/candidate"
import { UserRole } from "@/types/entities/user"

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
  return (
    <Link
      className={classNames(
        className,
        "group flex gap-4 pt-4 first:-mt-3 relative after:absolute after:top-0 after:-left-[var(--spacing-content)] after:-right-[var(--spacing-content)] after:bottom-0 after:-z-1 after:bg-[rgba(20,20,20)] after:opacity-0 after:transition-all hover:after:opacity-100",
      )}
      href={url}
    >
      <Image
        className="shrink-0 w-18 h-18 rounded-full"
        src={getProfileAvatar({ profile: candidate, role: UserRole.Candidate })}
        width={300}
        height={300}
        alt=""
      />

      <div className="flex flex-col gap-2 grow pb-4 min-h-[calc(var(--spacing)*22)] border-b border-border group-[:last-child]:border-b-0">
        {headerChildren && (
          <div className="flex items-center gap-6 text-sm text-secondary-light">
            {headerChildren}
          </div>
        )}

        <h3 className="text-h3">
          {candidate.lastName} {candidate.firstName}
        </h3>

        {(candidate.phoneNumber || candidate.tgUsername || candidate.city) && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-secondary-light">
            {candidate?.phoneNumber && <p>{candidate.phoneNumber}</p>}
            {candidate?.tgUsername && <p>@{candidate.tgUsername}</p>}
            {candidate?.city && <p>{candidate.city.name}</p>}
          </div>
        )}

        {footerChildren}
      </div>
    </Link>
  )
}
