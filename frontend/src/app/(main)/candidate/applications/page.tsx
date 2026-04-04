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
  ApplicationStatuses,
  ApplicationType,
  ApplicationTypes,
} from "@/types/entities/application"
import ApplicationCard from "@/components/base/application/ApplicationCard"
import { Routes } from "@/config/routes"

const Content = () => {
  const [type, setType] = useState<ApplicationType>(ApplicationType.Response)
  const [query, setQuery] = useState<string | null>(null)
  const [status, setStatus] = useState<ApplicationStatus | null>(null)

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
            className="min-w-1/2"
            prefix={<Icon icon="search" />}
            value={query}
            onChange={setQuery}
            placeholder="Поиск по откликам и приглашениям"
          />
          <Select<ApplicationStatus | null>
            className="min-w-1/5"
            value={status}
            onChange={setStatus}
            items={[
              { value: null, content: "Все статусы" },
              ...(Object.values(ApplicationStatus) as ApplicationStatus[]).map(
                (item) => ({
                  value: item,
                  content: ApplicationStatuses[item],
                }),
              ),
            ]}
          />
        </div>

        <HighlightList.Root
          className="flex flex-row border border-border p-1 rounded"
          highlightClassName="bg-primary"
        >
          {Object.values(ApplicationType).map((type_) => (
            <HighlightList.Item
              key={type_}
              className="w-full py-1 transition-all hover:text-fg-heading"
              activeClassName="text-fg-heading"
              active={type_ === type}
            >
              <Button type="base" onClick={() => setType(type_)}>
                {ApplicationTypes[type_]}
              </Button>
            </HighlightList.Item>
          ))}
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
