"use client"

import { useParams } from "next/navigation"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import VacancyDetailed from "@/components/base/vacancy/VacancyDetailed"

export default function CandidateVacancyPage() {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  return (
    <AuthProvider
      roles={[UserRole.Candidate]}
      Component={() => (
        <VacancyDetailed id={vacancyId} role={UserRole.Candidate} />
      )}
    />
  )
}
