import { useMatchedVacancyCandidates } from "@/api/vacancies/get-matched-vacancy-candidates"
import MatchPercent from "@/components/base/MatchPercent"
import CandidateCard from "@/components/base/candidate/CandidateCard"
import RemoteData from "@/components/ui/RemoteData"
import { Routes } from "@/config/routes"
import { Vacancy } from "@/types/entities/vacancy"

interface Props {
  vacancy: Vacancy
}

export default function RecruiterVacancyMatchedCandidates({ vacancy }: Props) {
  const candidates = useMatchedVacancyCandidates({ vacancyId: vacancy.id })

  return (
    <RemoteData
      data={candidates}
      onSuccess={(candidates) =>
        candidates.length ? (
          <div className="flex flex-col">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                url={Routes.recruiter.candidate(candidate.id)}
                headerChildren={
                  candidate.matchPercent !== undefined && (
                    <MatchPercent percent={candidate.matchPercent} />
                  )
                }
              />
            ))}
          </div>
        ) : (
          <p className="m-auto">Подходящих соискателей пока нет</p>
        )
      }
    />
  )
}
