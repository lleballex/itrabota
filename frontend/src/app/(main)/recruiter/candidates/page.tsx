"use client"

import { useState } from "react"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import Input from "@/components/ui/Input"
import Icon from "@/components/ui/Icon"
import RemoteData from "@/components/ui/RemoteData"
import CandidateCard from "@/components/base/candidate/CandidateCard"
import { useCandidates } from "@/api/candidates/get-candidates"
import { Routes } from "@/config/routes"

const Content = () => {
  const [query, setQuery] = useState<string | null>(null)

  const candidates = useCandidates({
    role: UserRole.Recruiter,
    query: query ?? undefined,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1">Соискатели</h1>
        <Input
          prefix={<Icon icon="search" />}
          value={query}
          onChange={setQuery}
          placeholder="Поиск"
        />
      </div>

      <div className="flex flex-col">
        <RemoteData
          data={candidates}
          onSuccess={(candidates) =>
            candidates.length
              ? candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    url={Routes.recruiter.candidate(candidate.id)}
                  />
                ))
              : "Ничего не найдено"
          }
        />
      </div>
    </div>
  )
}

export default function RecruiterCandidatesPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
