"use client"

import { useParams } from "next/navigation"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import RemoteData from "@/components/ui/RemoteData"
import { useCandidate } from "@/api/candidates/get-candidate"
import CandidateDetailed from "@/components/base/candidate/CandidateDetailed"

const Content = () => {
  const { candidateId } = useParams<{ candidateId: string }>()
  const candidate = useCandidate({ id: candidateId })

  return (
    <RemoteData
      data={candidate}
      onSuccess={(candidate) => (
        <CandidateDetailed candidate={candidate} role={UserRole.Recruiter} />
      )}
    />
  )
}

export default function RecruiterCandidatePage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
