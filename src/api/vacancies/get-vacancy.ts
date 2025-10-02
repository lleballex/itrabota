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
  id: string
}

const mockedData: Vacancy = {
  id: "1",
  createdAt: "2022-01-01T10:00Z",
  updatedAt: "2022-01-01T10:00Z",
  status: VacancyStatus.Active,
  salaryFrom: 1000,
  salaryTo: 2000,
  description:
    "Strange entire select nice joined screen bite cattle college thirty whispered join notice already brush farmer movie hurry smooth opportunity symbol beneath sum fix",
  requirements:
    "Previous whenever gave date attempt facing corn whispered accurate fog before frozen soil rise trap action tight promised burst hide size design farmer customs",
  niceToHave:
    "Office cover weak cowboy start instrument somehow corn story selection high atom salmon pot pool flow past military saw result vast goose carry rocket",
  conditions:
    "Pet yes everywhere living saw solution recently lamp fully return tribe beginning talk flow full stems wet tape winter women coat sent birthday very",
  responsibilities:
    "Establish breathe eleven fifty soon twice headed dust caught buffalo bridge character mountain refer fed rest excitement success stand empty pony ruler have where",
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
  skills: [
    {
      id: "1",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "2",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "3",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "4",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "5",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "6",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "7",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "8",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "9",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "10",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "11",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "12",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "13",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "14",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "15",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "16",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "17",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
    {
      id: "18",
      createdAt: "2022-01-01T10:00Z",
      updatedAt: "2022-01-01T10:00Z",
      name: "React",
    },
  ],
}

export const useVacancy = createUseQuery(
  "vacancies",
  ({ id, ...params }: Params) =>
    axios
      .get<Vacancy>(`/vacancies/${id}`, { params })
      .then((res) => res.data)
      .catch(() => mockedData)
)
