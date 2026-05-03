"use client"

import { ReactNode, useDeferredValue, useMemo, useState } from "react"

import { useVacancies } from "@/api/vacancies/get-vacancies"
import { useCities } from "@/api/cities/get-cities"
import { useSpecializations } from "@/api/specializations/get-specializations"
import { useSkills } from "@/api/skills/get-skills"
import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"
import Input from "@/components/ui/Input"
import Icon from "@/components/ui/Icon"
import RemoteData from "@/components/ui/RemoteData"
import VacancyCard from "@/components/base/vacancy/VacancyCard"
import { Routes } from "@/config/routes"
import Select from "@/components/ui/Select"
import Checkbox from "@/components/ui/Checkbox"
import Button from "@/components/ui/Button"
import Drawer from "@/components/ui/Drawer"
import Tooltip from "@/components/ui/Tooltip"
import { Skill } from "@/types/entities/skill"
import {
  VacancyEmploymentType,
  VacancyEmploymentTypes,
  VacancyFormat,
  VacancyFormats,
  VacancySchedule,
  VacancySchedules,
  VacancyWorkExperience,
  VacancyWorkExperiences,
} from "@/types/entities/vacancy"

interface VacancyFilters {
  query: string | null
  matchForMe: boolean
  employmentTypes: VacancyEmploymentType[]
  formats: VacancyFormat[]
  schedules: VacancySchedule[]
  workExperiences: VacancyWorkExperience[]
  specializationIds: string[]
  cityIds: string[]
  skillIds: string[]
  salaryFrom: string | null
  salaryTo: string | null
}

type DrawerFilterKey = Exclude<keyof VacancyFilters, "query" | "matchForMe">

const DEFAULT_FILTERS: VacancyFilters = {
  query: null,
  matchForMe: false,
  employmentTypes: [],
  formats: [],
  schedules: [],
  workExperiences: [],
  specializationIds: [],
  cityIds: [],
  skillIds: [],
  salaryFrom: null,
  salaryTo: null,
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

  const normalizedValue = Number(value.replace(/[^\d]/g, ""))

  if (Number.isNaN(normalizedValue)) {
    return null
  }

  return normalizedValue
}

const getActiveDrawerFiltersCount = (filters: VacancyFilters) =>
  [
    filters.employmentTypes.length,
    filters.formats.length,
    filters.schedules.length,
    filters.workExperiences.length,
    filters.specializationIds.length,
    filters.cityIds.length,
    filters.skillIds.length,
    filters.salaryFrom ? 1 : 0,
    filters.salaryTo ? 1 : 0,
  ].reduce((acc, count) => acc + count, 0)

const resetDrawerFilters = (filters: VacancyFilters): VacancyFilters => ({
  ...DEFAULT_FILTERS,
  query: filters.query,
  matchForMe: filters.matchForMe,
})

const Content = ({ me: _me }: { me: User }) => {
  void _me

  const [filters, setFilters] = useState<VacancyFilters>(DEFAULT_FILTERS)
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

  const vacancies = useVacancies({
    role: UserRole.Candidate,
    query: deferredQuery?.trim() || undefined,
    matchForMe: filters.matchForMe || undefined,
    employmentTypes: filters.employmentTypes.length
      ? filters.employmentTypes
      : undefined,
    formats: filters.formats.length ? filters.formats : undefined,
    schedules: filters.schedules.length ? filters.schedules : undefined,
    workExperiences: filters.workExperiences.length
      ? filters.workExperiences
      : undefined,
    specializationIds: filters.specializationIds.length
      ? filters.specializationIds
      : undefined,
    cityIds: filters.cityIds.length ? filters.cityIds : undefined,
    skillIds: filters.skillIds.length ? filters.skillIds : undefined,
    salaryFrom: getNumberValue(filters.salaryFrom) ?? undefined,
    salaryTo: getNumberValue(filters.salaryTo) ?? undefined,
  })

  const updateFilters = <K extends keyof VacancyFilters>(
    key: K,
    value: VacancyFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateDrawerFilter = <K extends DrawerFilterKey>(
    key: K,
    value: VacancyFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      matchForMe: false,
      [key]: value,
    }))
  }

  const updateMatchForMe = (value: boolean) => {
    setFilters((prev) => ({
      ...(value ? resetDrawerFilters(prev) : prev),
      matchForMe: value,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1">Вакансии</h1>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 grow-1">
            <Input
              className="w-full max-w-[600px]"
              prefix={<Icon icon="search" />}
              value={filters.query}
              onChange={(value) => updateFilters("query", value)}
              placeholder="Поиск по вакансиям"
            />

            <Checkbox
              className="shrink-0"
              value={filters.matchForMe}
              onChange={updateMatchForMe}
            >
              <span className="flex items-center gap-1">
                Подобрать для меня
                <Tooltip content="Покажем вакансии, которые лучше всего совпадают с данными, которые вы указали в резюме">
                  <button
                    className="flex items-center justify-center rounded-full text-fg/70 transition hover:text-fg"
                    type="button"
                    aria-label="Что значит подобрать для меня"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Icon className="text-[16px]" icon="info" />
                  </button>
                </Tooltip>
              </span>
            </Checkbox>
          </div>

          <Button
            className="relative shrink-0"
            type="base"
            onClick={() => setIsFiltersDrawerActive(true)}
          >
            <Icon className="text-[24px]" icon="settings" />
            {activeDrawerFiltersCount > 0 && !filters.matchForMe && (
              <span className="absolute -top-0.5 -right-0.5 block h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        <RemoteData
          data={vacancies}
          onSuccess={(vacancies) =>
            vacancies.length ? (
              vacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  url={Routes.candidate.vacancy(vacancy.id)}
                  role={UserRole.Candidate}
                />
              ))
            ) : (
              <p>Ничего не найдено</p>
            )
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
            value={filters.workExperiences}
            onChange={(value) =>
              updateDrawerFilter(
                "workExperiences",
                Array.isArray(value) ? value : [],
              )
            }
            label="Опыт работы"
            renderValue={({ selectedItems }) =>
              getMultiSelectValue(selectedItems, "Любой опыт")
            }
            items={Object.entries(VacancyWorkExperiences).map(
              ([value, content]) => ({
                value: value as VacancyWorkExperience,
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

export default function CandidateVacanciesPage() {
  return <AuthProvider roles={[UserRole.Candidate]} Component={Content} />
}
