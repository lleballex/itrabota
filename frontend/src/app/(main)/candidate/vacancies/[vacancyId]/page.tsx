"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"
import VacancyDetailed from "@/components/base/vacancy/VacancyDetailed"
import { useVacancy } from "@/api/vacancies/get-vacancy"
import HighlightList from "@/components/ui/HighlightList"
import Button from "@/components/ui/Button"
import { useMyApplication } from "@/api/applications/get-my-application"
import RemoteData from "@/components/ui/RemoteData"
import VacancyRespondModal from "@/components/base/vacancy/VacancyRespondModal"
import { Vacancy } from "@/types/entities/vacancy"
import { Application } from "@/types/entities/application"
import ApplicationDetailed from "@/components/base/application/ApplicationDetailed"

interface Props {
  vacancy: Vacancy
  application: Application | null
  me: User
}

const LoadedContent = ({ vacancy, application, me }: Props) => {
  const [isRespondModalActive, setIsRespondModalActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"vacancy" | "application">(
    "vacancy"
  )

  return (
    <div className="flex flex-col gap-6">
      {application && (
        <HighlightList.Root
          className="flex flex-row border border-border p-1 rounded"
          highlightClassName="bg-primary"
        >
          <HighlightList.Item
            className="w-full py-1"
            active={activeTab === "vacancy"}
          >
            <Button type="base" onClick={() => setActiveTab("vacancy")}>
              Вакансия
            </Button>
          </HighlightList.Item>
          <HighlightList.Item
            className="w-full py-1"
            active={activeTab === "application"}
          >
            <Button type="base" onClick={() => setActiveTab("application")}>
              Мой отклик
            </Button>
          </HighlightList.Item>
        </HighlightList.Root>
      )}

      {activeTab === "vacancy" && (
        <>
          <VacancyDetailed
            vacancy={vacancy}
            controls={
              !application && (
                <Button
                  type="glass"
                  onClick={() => setIsRespondModalActive(true)}
                >
                  Откликнуться
                </Button>
              )
            }
          />
          <VacancyRespondModal
            vacancy={vacancy}
            active={isRespondModalActive}
            onActiveChange={setIsRespondModalActive}
          />
        </>
      )}

      {activeTab === "application" && application && (
        <ApplicationDetailed
          application={application}
          vacancy={vacancy}
          me={me}
        />
      )}
    </div>
  )
}

const Content = ({ me }: { me: User }) => {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const vacancy = useVacancy({ id: vacancyId })
  const application = useMyApplication({ vacancyId })

  return (
    <RemoteData
      data={vacancy}
      onSuccess={(vacancy) => (
        <RemoteData
          data={application}
          onSuccess={(application) => (
            <LoadedContent
              vacancy={vacancy}
              application={application}
              me={me}
            />
          )}
        />
      )}
    />
  )
}

export default function CandidateVacancyPage() {
  return <AuthProvider roles={[UserRole.Candidate]} Component={Content} />
}
