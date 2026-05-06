"use client"

import { ReactNode, useDeferredValue, useMemo, useState } from "react"

import { useCandidates } from "@/api/candidates/get-candidates"
import { useCities } from "@/api/cities/get-cities"
import { useSkills } from "@/api/skills/get-skills"
import { useSpecializations } from "@/api/specializations/get-specializations"
import CandidateCard from "@/components/base/candidate/CandidateCard"
import AuthProvider from "@/components/special/AuthProvider"
import Button from "@/components/ui/Button"
import Drawer from "@/components/ui/Drawer"
import Icon from "@/components/ui/Icon"
import Input from "@/components/ui/Input"
import RemoteData from "@/components/ui/RemoteData"
import Select from "@/components/ui/Select"
import { Routes } from "@/config/routes"
import { Skill } from "@/types/entities/skill"
import { UserRole } from "@/types/entities/user"
import {
  VacancyEmploymentType,
  VacancyEmploymentTypes,
  VacancyFormat,
  VacancyFormats,
  VacancySchedule,
  VacancySchedules,
} from "@/types/entities/vacancy"

interface CandidateFilters {
  query: string | null
  employmentTypes: VacancyEmploymentType[]
  formats: VacancyFormat[]
  schedules: VacancySchedule[]
  specializationIds: string[]
  cityIds: string[]
  skillIds: string[]
  salaryFrom: string | null
  salaryTo: string | null
  experienceYearsFrom: string | null
  ageFrom: string | null
  ageTo: string | null
}

type DrawerFilterKey = Exclude<keyof CandidateFilters, "query">

const DEFAULT_FILTERS: CandidateFilters = {
  query: null,
  employmentTypes: [],
  formats: [],
  schedules: [],
  specializationIds: [],
  cityIds: [],
  skillIds: [],
  salaryFrom: null,
  salaryTo: null,
  experienceYearsFrom: null,
  ageFrom: null,
  ageTo: null,
}

const getMultiSelectValue = <V,>(
  selectedItems: { value: V; content: ReactNode }[],
  fallback: string,
) => {
  if (!selectedItems.length) {
    return fallback
  }

  if (selectedItems.every((item) => typeof item.content === "string")) {
    return selectedItems.map((item) => item.content as string).join(", ")
  }

  return `Выбрано: ${selectedItems.length}`
}

const getNumberValue = (value: string | null) => {
  if (!value) return null

  const digits = value.replace(/[^\d]/g, "")

  if (!digits) return null

  const normalizedValue = Number(digits)

  if (Number.isNaN(normalizedValue)) {
    return null
  }

  return normalizedValue
}

const getActiveDrawerFiltersCount = (filters: CandidateFilters) =>
  [
    filters.employmentTypes.length,
    filters.formats.length,
    filters.schedules.length,
    filters.specializationIds.length,
    filters.cityIds.length,
    filters.skillIds.length,
    filters.salaryFrom ? 1 : 0,
    filters.salaryTo ? 1 : 0,
    filters.experienceYearsFrom ? 1 : 0,
    filters.ageFrom ? 1 : 0,
    filters.ageTo ? 1 : 0,
  ].reduce((acc, count) => acc + count, 0)

const resetDrawerFilters = (filters: CandidateFilters): CandidateFilters => ({
  ...DEFAULT_FILTERS,
  query: filters.query,
})

const Content = () => {
  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_FILTERS)
  const [isFiltersDrawerActive, setIsFiltersDrawerActive] = useState(false)
  const deferredQuery = useDeferredValue(filters.query)

  const cities = useCities()
  const specializations = useSpecializations()
  const skills = useSkills()

  const availableSkills = useMemo<Skill[]>(() => {
    if (skills.status === "success" && skills.data.length) {
      return skills.data
    }

    return []
  }, [skills])

  const activeDrawerFiltersCount = useMemo(
    () => getActiveDrawerFiltersCount(filters),
    [filters],
  )

  const experienceYearsFrom = getNumberValue(filters.experienceYearsFrom)

  const candidates = useCandidates({
    role: UserRole.Recruiter,
    query: deferredQuery?.trim() || undefined,
    employmentTypes: filters.employmentTypes.length
      ? filters.employmentTypes
      : undefined,
    formats: filters.formats.length ? filters.formats : undefined,
    schedules: filters.schedules.length ? filters.schedules : undefined,
    specializationIds: filters.specializationIds.length
      ? filters.specializationIds
      : undefined,
    cityIds: filters.cityIds.length ? filters.cityIds : undefined,
    skillIds: filters.skillIds.length ? filters.skillIds : undefined,
    salaryFrom: getNumberValue(filters.salaryFrom) ?? undefined,
    salaryTo: getNumberValue(filters.salaryTo) ?? undefined,
    totalWorkExperienceMonthsMin:
      experienceYearsFrom === null ? undefined : experienceYearsFrom * 12,
    ageFrom: getNumberValue(filters.ageFrom) ?? undefined,
    ageTo: getNumberValue(filters.ageTo) ?? undefined,
  })

  const updateFilters = <K extends keyof CandidateFilters>(
    key: K,
    value: CandidateFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateDrawerFilter = <K extends DrawerFilterKey>(
    key: K,
    value: CandidateFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1">Соискатели</h1>

        <div className="flex items-center justify-between gap-3">
          <Input
            className="w-full max-w-[600px]"
            prefix={<Icon icon="search" />}
            value={filters.query}
            onChange={(value) => updateFilters("query", value)}
            placeholder="Поиск"
          />

          <Button
            className="relative shrink-0"
            type="base"
            onClick={() => setIsFiltersDrawerActive(true)}
          >
            <Icon className="text-[24px]" icon="settings" />
            {activeDrawerFiltersCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 block h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Button>
        </div>
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

      <Drawer.Root
        active={isFiltersDrawerActive}
        onActiveChange={setIsFiltersDrawerActive}
      >
        <Drawer.Header>Фильтры</Drawer.Header>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          <Select
            multiple
            value={filters.formats}
            onChange={(value) =>
              updateDrawerFilter("formats", Array.isArray(value) ? value : [])
            }
            label="Формат работы"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Все форматы")
            }
            items={Object.entries(VacancyFormats).map(([value, content]) => ({
              value: value as VacancyFormat,
              content,
            }))}
          />

          <Select
            multiple
            value={filters.employmentTypes}
            onChange={(value) =>
              updateDrawerFilter(
                "employmentTypes",
                Array.isArray(value) ? value : [],
              )
            }
            label="Тип занятости"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Любой тип")
            }
            items={Object.entries(VacancyEmploymentTypes).map(
              ([value, content]) => ({
                value: value as VacancyEmploymentType,
                content,
              }),
            )}
          />

          <Select
            multiple
            value={filters.schedules}
            onChange={(value) =>
              updateDrawerFilter("schedules", Array.isArray(value) ? value : [])
            }
            label="График работы"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Любой график")
            }
            items={Object.entries(VacancySchedules).map(([value, content]) => ({
              value: value as VacancySchedule,
              content,
            }))}
          />

          <Select
            multiple
            value={filters.specializationIds}
            onChange={(value) =>
              updateDrawerFilter(
                "specializationIds",
                Array.isArray(value) ? value : [],
              )
            }
            label="Направление"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Любое направление")
            }
            items={
              specializations.status === "success"
                ? specializations.data.map((specialization) => ({
                    value: specialization.id,
                    content: specialization.name,
                  }))
                : []
            }
          />

          <Select
            multiple
            value={filters.cityIds}
            onChange={(value) =>
              updateDrawerFilter("cityIds", Array.isArray(value) ? value : [])
            }
            label="Город"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Любой город")
            }
            items={
              cities.status === "success"
                ? cities.data.map((city) => ({
                    value: city.id,
                    content: city.name,
                  }))
                : []
            }
          />

          <Select
            multiple
            value={filters.skillIds}
            onChange={(value) =>
              updateDrawerFilter("skillIds", Array.isArray(value) ? value : [])
            }
            label="Навыки"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Любые навыки")
            }
            items={availableSkills.map((skill) => ({
              value: skill.id,
              content: skill.name,
            }))}
          />

          <Input
            className="w-full"
            label="Зарплата от"
            value={filters.salaryFrom}
            onChange={(value) => updateDrawerFilter("salaryFrom", value)}
            placeholder="150000"
          />

          <Input
            className="w-full"
            label="Зарплата до"
            value={filters.salaryTo}
            onChange={(value) => updateDrawerFilter("salaryTo", value)}
            placeholder="300000"
          />

          <Input
            className="w-full"
            label="Опыт от, лет"
            value={filters.experienceYearsFrom}
            onChange={(value) =>
              updateDrawerFilter("experienceYearsFrom", value)
            }
            placeholder="3"
          />

          <Input
            className="w-full"
            label="Возраст от"
            value={filters.ageFrom}
            onChange={(value) => updateDrawerFilter("ageFrom", value)}
            placeholder="18"
          />

          <Input
            className="w-full"
            label="Возраст до"
            value={filters.ageTo}
            onChange={(value) => updateDrawerFilter("ageTo", value)}
            placeholder="45"
          />
        </div>

        <div className="flex gap-2 border-t border-border pt-3">
          <Button
            className="w-full"
            type="secondary"
            onClick={() => {
              setFilters(resetDrawerFilters)
              setIsFiltersDrawerActive(false)
            }}
          >
            Сбросить
          </Button>
          <Button
            className="w-full"
            type="primary"
            onClick={() => setIsFiltersDrawerActive(false)}
          >
            Применить
          </Button>
        </div>
      </Drawer.Root>
    </div>
  )
}

export default function RecruiterCandidatesPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
