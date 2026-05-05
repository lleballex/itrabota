"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"
import RemoteData from "@/components/ui/RemoteData"
import { useApplication } from "@/api/applications/get-application"
import HighlightList from "@/components/ui/HighlightList"
import Button from "@/components/ui/Button"
import VacancyDetailed from "@/components/base/vacancy/VacancyDetailed"
import ApplicationDetailed from "@/components/base/application/ApplicationDetailed"
import { Application } from "@/types/entities/application"
import CandidateDetailed from "@/components/base/candidate/CandidateDetailed"

const LoadedContent = ({
  application,
  me,
}: {
  application: Application
  me: User
}) => {
  const [activeTab, setActiveTab] = useState<
    "vacancy" | "candidate" | "application"
  >("application")

  return (
    <div
      className={
        activeTab === "application"
          ? "flex flex-col gap-6 h-[calc(100dvh-var(--spacing-screen)*2-var(--height-control)-var(--spacing)*5)] min-h-0"
          : "flex flex-col gap-6"
      }
    >
      <HighlightList.Root
        className="flex flex-row border border-border p-1 rounded shrink-0"
        highlightClassName="bg-primary"
      >
        <HighlightList.Item
          className="w-full py-1 transition-all hover:text-fg-heading"
          activeClassName="text-fg-heading"
          active={activeTab === "vacancy"}
        >
          <Button type="base" onClick={() => setActiveTab("vacancy")}>
            Вакансия
          </Button>
        </HighlightList.Item>
        <HighlightList.Item
          className="w-full py-1 transition-all hover:text-fg-heading"
          activeClassName="text-fg-heading"
          active={activeTab === "candidate"}
        >
          <Button type="base" onClick={() => setActiveTab("candidate")}>
            Кандидат
          </Button>
        </HighlightList.Item>
        <HighlightList.Item
          className="w-full py-1 transition-all hover:text-fg-heading"
          activeClassName="text-fg-heading"
          active={activeTab === "application"}
        >
          <Button type="base" onClick={() => setActiveTab("application")}>
            Отклик
          </Button>
        </HighlightList.Item>
      </HighlightList.Root>

      {activeTab === "vacancy" && application.vacancy && (
        <VacancyDetailed vacancy={application.vacancy} />
      )}

      {activeTab === "candidate" && application.candidate && (
        <CandidateDetailed
          candidate={application.candidate}
          role={UserRole.Recruiter}
          withInviteAction={false}
        />
      )}

      {activeTab === "application" && application.vacancy && (
        <div className="grow min-h-0">
          <ApplicationDetailed
            application={application}
            vacancy={application.vacancy}
            me={me}
          />
        </div>
      )}
    </div>
  )
}

const Content = ({ me }: { me: User }) => {
  const { applicationId } = useParams<{ applicationId: string }>()

  const application = useApplication({ id: applicationId })

  return (
    <RemoteData
      data={application}
      onSuccess={(application) => (
        <LoadedContent me={me} application={application} />
      )}
    />
  )
}

export default function RecruiterApplicationPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
