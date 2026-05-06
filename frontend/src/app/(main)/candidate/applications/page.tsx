"use client"

import { useState } from "react"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import HighlightList from "@/components/ui/HighlightList"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Icon from "@/components/ui/Icon"
import Select from "@/components/ui/Select"
import RemoteData from "@/components/ui/RemoteData"
import { useApplications } from "@/api/applications/get-applications"
import {
  ApplicationStatus,
  ApplicationType,
} from "@/types/entities/application"
import ApplicationCard from "@/components/base/application/ApplicationCard"
import ApplicationStatusMarker from "@/components/base/application/ApplicationStatus"
import { Routes } from "@/config/routes"
import { useQueryState } from "@/lib/use-query-state"

const applicationTypeTabs = [
  ApplicationType.Response,
  ApplicationType.Invitation,
] as const

const Content = () => {
  const [type, setType] = useQueryState(
    "tab",
    applicationTypeTabs,
    ApplicationType.Response,
  )
  const [query, setQuery] = useState<string | null>(null)
  const [status, setStatus] = useState<ApplicationStatus | null>(
    ApplicationStatus.Pending,
  )

  const applications = useApplications({
    role: UserRole.Candidate,
    type,
    query: query ?? undefined,
    status: status ?? undefined,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1">Отклики и приглашения</h1>

        <div className="flex gap-2">
          <Input
            className="w-full max-w-[600px]"
            prefix={<Icon icon="search" />}
            value={query}
            onChange={setQuery}
            placeholder="Поиск по откликам и приглашениям"
          />
          <Select<ApplicationStatus | null>
            className="min-w-1/5"
            value={status}
            onChange={(value) => setStatus(Array.isArray(value) ? null : value)}
            items={[
              { value: null, content: "Все статусы" },
              ...(Object.values(ApplicationStatus) as ApplicationStatus[]).map(
                (item) => ({
                  value: item,
                  content: <ApplicationStatusMarker status={item} />,
                }),
              ),
            ]}
          />
        </div>

        <HighlightList.Root
          className="flex flex-row border border-border p-1 rounded"
          highlightClassName="bg-primary"
        >
          <HighlightList.Item
            className="w-full py-1 transition-all hover:text-fg-heading"
            activeClassName="text-fg-heading"
            active={type === ApplicationType.Response}
          >
            <Button
              type="base"
              onClick={() => setType(ApplicationType.Response)}
            >
              Отклики
            </Button>
          </HighlightList.Item>
          <HighlightList.Item
            className="w-full py-1 transition-all hover:text-fg-heading"
            activeClassName="text-fg-heading"
            active={type === ApplicationType.Invitation}
          >
            <Button
              type="base"
              onClick={() => setType(ApplicationType.Invitation)}
            >
              Приглашения
            </Button>
          </HighlightList.Item>
        </HighlightList.Root>
      </div>

      <div className="flex flex-col">
        <RemoteData
          data={applications}
          onSuccess={(applications) =>
            applications.length ? (
              applications.map((application) =>
                application.vacancy ? (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    role={UserRole.Candidate}
                    url={Routes.candidate.vacancy(application.vacancy.id, {
                      tab: "application",
                    })}
                  />
                ) : null,
              )
            ) : (
              <p>Ничего не найдено</p>
            )
          }
        />
      </div>
    </div>
  )
}

export default function CandidateApplicationsPage() {
  return <AuthProvider roles={[UserRole.Candidate]} Component={Content} />
}
