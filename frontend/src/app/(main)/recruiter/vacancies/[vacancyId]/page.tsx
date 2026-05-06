"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"
import VacancyDetailed from "@/components/base/vacancy/VacancyDetailed"
import { useVacancy } from "@/api/vacancies/get-vacancy"
import RemoteData from "@/components/ui/RemoteData"
import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"
import Icon from "@/components/ui/Icon"
import { Vacancy, VacancyStatus } from "@/types/entities/vacancy"
import HighlightList from "@/components/ui/HighlightList"
import Tooltip from "@/components/ui/Tooltip"
import RecruiterVacancyApplications from "./_components/RecruiterVacancyApplications"
import RecruiterVacancyMatchedCandidates from "./_components/RecruiterVacancyMatchedCandidates"
import VacancyArchiveConfirmModal, {
  VacancyArchiveAction,
} from "./_components/VacancyArchiveConfirmModal"
import { useQueryState } from "@/lib/use-query-state"

interface Props {
  vacancy: Vacancy
}

type VacancyTab = "vacancy" | "applications" | "matchedCandidates"
const vacancyTabs = ["vacancy", "applications", "matchedCandidates"] as const

const LoadedContent = ({ vacancy }: Props) => {
  const [activeTab, setActiveTab] = useQueryState<VacancyTab>(
    "tab",
    vacancyTabs,
    "vacancy",
  )
  const [archiveAction, setArchiveAction] =
    useState<VacancyArchiveAction | null>(null)

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
          active={activeTab === "applications"}
        >
          <Button type="base" onClick={() => setActiveTab("applications")}>
            Отклики
          </Button>
        </HighlightList.Item>
        <HighlightList.Item
          className="w-full py-1 transition-all hover:text-fg-heading"
          activeClassName="text-fg-heading"
          active={activeTab === "matchedCandidates"}
        >
          <Button type="base" onClick={() => setActiveTab("matchedCandidates")}>
            <span className="inline-flex items-center justify-center gap-1">
              Подходящие соискатели
              <Tooltip
                className="text-left"
                content="Подберём соискателей, которые лучше всего подходят вашей вакансии."
                position="right"
              >
                <span
                  className="inline-flex transition-all"
                  tabIndex={0}
                  aria-label="О подходящих соискателях"
                >
                  <Icon className="text-[16px]" icon="info" />
                </span>
              </Tooltip>
            </span>
          </Button>
        </HighlightList.Item>
      </HighlightList.Root>

      {activeTab === "vacancy" && (
        <VacancyDetailed
          vacancy={vacancy}
          controls={
            <>
              <Button
                type="glass"
                link={{ url: Routes.recruiter.editVacancy(vacancy.id) }}
              >
                <Icon icon="pen" />
                Изменить
              </Button>
              {vacancy.status === VacancyStatus.Active && (
                <Button
                  type="glass"
                  onClick={() => setArchiveAction("archive")}
                >
                  <Icon icon="archive" />В архив
                </Button>
              )}
              {vacancy.status === VacancyStatus.Archived && (
                <Button
                  type="glass"
                  onClick={() => setArchiveAction("restore")}
                >
                  <Icon icon="archiveRestore" />
                  Вернуть из архива
                </Button>
              )}
            </>
          }
        />
      )}

      {activeTab === "applications" && (
        <RecruiterVacancyApplications vacancy={vacancy} />
      )}

      {activeTab === "matchedCandidates" && (
        <RecruiterVacancyMatchedCandidates vacancy={vacancy} />
      )}

      <VacancyArchiveConfirmModal
        vacancy={vacancy}
        action={archiveAction}
        active={archiveAction !== null}
        onActiveChange={(active) => {
          if (!active) {
            setArchiveAction(null)
          }
        }}
      />
    </div>
  )
}

const Content = () => {
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const vacancy = useVacancy({ id: vacancyId })

  return (
    <RemoteData
      data={vacancy}
      onSuccess={(vacancy) => <LoadedContent vacancy={vacancy} />}
    />
  )
}

export default function RecruiterVacancyPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
