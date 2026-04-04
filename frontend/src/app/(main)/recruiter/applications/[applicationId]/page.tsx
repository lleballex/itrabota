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
    <div className="flex flex-col gap-6 h-full">
      <HighlightList.Root
        className="flex flex-row border border-border p-1 rounded"
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
            Соискатель
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

      {activeTab === "candidate" && "*candidate*"}

      {activeTab === "application" && application.vacancy && (
        <ApplicationDetailed
          application={application}
          vacancy={application.vacancy}
          me={me}
        />
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
