import { createUseQuery } from "@/api/lib/create-use-query"
import { axios } from "@/api/lib/axios"
import {
  Vacancy,
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyStatus,
  VacancyWorkExperience,
} from "@/types/entities/vacancy"

interface Params {
  query?: string
  status?: VacancyStatus
}

const mockedData: Vacancy[] = [
  {
    id: "1",
    createdAt: "2022-01-01T10:00Z",
    updatedAt: "2022-01-01T10:00Z",
    status: VacancyStatus.Active,
    salaryFrom: 1000,
    salaryTo: 2000,
    description: null,
    requirements: null,
    niceToHave: null,
    conditions: null,
    responsibilities: null,
    employmentType: VacancyEmploymentType.FullTime,
    title: "JS web developer",
    workExperience: VacancyWorkExperience.None,
    specialization: {
      id: "1",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "Web-development",
    },
    company: {
      id: "1",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      logo: null,
      url: null,
      name: "ООО Технхопарк",
      industry: {
        id: "1",
        createdAt: "2022-01-01T10:00Z",
        updatedAt: "2022-01-01T10:00Z",
        name: "Информационные технологии",
      },
    },
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FourTwo,
    responsesCount: 2,
  },
  {
    id: "2",
    createdAt: "2022-01-01T10:00Z",
    updatedAt: "2022-01-01T10:00Z",
    status: VacancyStatus.Active,
    salaryFrom: 1000,
    salaryTo: 2000,
    description: null,
    requirements: null,
    niceToHave: null,
    conditions: null,
    responsibilities: null,
    employmentType: VacancyEmploymentType.FullTime,
    title: "JS web developer",
    workExperience: VacancyWorkExperience.None,
    specialization: {
      id: "1",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "Web-development",
    },
    company: {
      id: "1",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      logo: null,
      url: null,
      name: "ООО Технхопарк",
      industry: {
        id: "1",
        createdAt: "2022-01-01T10:00Z",
        updatedAt: "2022-01-01T10:00Z",
        name: "Информационные технологии",
      },
    },
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FourTwo,
    responsesCount: 2,
  },
]

export const useVacancies = createUseQuery("vacancies", (params: Params) =>
  axios
    .get<Vacancy[]>("/vacancies", { params })
    .then((res) => res.data)
    .catch(() => mockedData)
)
