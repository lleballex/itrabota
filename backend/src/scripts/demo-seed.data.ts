import {
  ApplicationMessageType,
  type ApplicationMessageType as TApplicationMessageType,
} from "@/modules/applications/entities/application-message.entity"
import {
  ApplicationStageRecommendation,
  type ApplicationStageRecommendation as TApplicationStageRecommendation,
} from "@/modules/applications/entities/application-stage-result.entity"
import {
  ApplicationStatus,
  ApplicationType,
  type ApplicationStatus as TApplicationStatus,
  type ApplicationType as TApplicationType,
} from "@/modules/applications/entities/application.entity"
import {
  UserRole,
  type UserRole as TUserRole,
} from "@/modules/users/types/user-role"
import {
  VacancyEmploymentType,
  VacancyFormat,
  VacancySchedule,
  VacancyStatus,
  VacancyWorkExperience,
  type VacancyEmploymentType as TVacancyEmploymentType,
  type VacancyFormat as TVacancyFormat,
  type VacancySchedule as TVacancySchedule,
  type VacancyStatus as TVacancyStatus,
  type VacancyWorkExperience as TVacancyWorkExperience,
} from "@/modules/vacancies/entities/vacancy.entity"

export const DEMO_PASSWORD_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$uCtf4tD4IGOIHMwwXGr1EQ$1GyL/maTcHCMT8yLaNL53yGRg3b/42dRobSk8UXYgHM"

export const DEMO_CITIES = [
  "Абакан",
  "Альметьевск",
  "Ангарск",
  "Арзамас",
  "Архангельск",
  "Астрахань",
  "Балашиха",
  "Барнаул",
  "Белгород",
  "Березники",
  "Бийск",
  "Благовещенск",
  "Братск",
  "Брянск",
  "Великий Новгород",
  "Владивосток",
  "Владикавказ",
  "Владимир",
  "Волгоград",
  "Волжский",
  "Вологда",
  "Воронеж",
  "Грозный",
  "Дзержинск",
  "Димитровград",
  "Екатеринбург",
  "Иваново",
  "Ижевск",
  "Иркутск",
  "Йошкар-Ола",
  "Казань",
  "Калининград",
  "Калуга",
  "Каменск-Уральский",
  "Кемерово",
  "Киров",
  "Комсомольск-на-Амуре",
  "Королёв",
  "Кострома",
  "Краснодар",
  "Красноярск",
  "Курган",
  "Курск",
  "Липецк",
  "Магнитогорск",
  "Махачкала",
  "Москва",
  "Мурманск",
  "Мытищи",
  "Набережные Челны",
  "Нальчик",
  "Нижневартовск",
  "Нижний Новгород",
  "Нижний Тагил",
  "Новокузнецк",
  "Новороссийск",
  "Новосибирск",
  "Омск",
  "Орёл",
  "Оренбург",
  "Пенза",
  "Пермь",
  "Петрозаводск",
  "Подольск",
  "Псков",
  "Пятигорск",
  "Ростов-на-Дону",
  "Рязань",
  "Самара",
  "Санкт-Петербург",
  "Саранск",
  "Саратов",
  "Севастополь",
  "Смоленск",
  "Сочи",
  "Ставрополь",
  "Стерлитамак",
  "Сургут",
  "Сыктывкар",
  "Таганрог",
  "Тамбов",
  "Тверь",
  "Тольятти",
  "Томск",
  "Тула",
  "Тюмень",
  "Улан-Удэ",
  "Ульяновск",
  "Уфа",
  "Хабаровск",
  "Химки",
  "Чебоксары",
  "Челябинск",
  "Череповец",
  "Чита",
  "Якутск",
  "Ярославль",
] as const

export const DEMO_INDUSTRIES = [
  "GameDev",
  "Интернет вещей (IoT)",
  "Технологии для HR",
  "Финтех",
  "Электронная коммерция",
  "Государственные цифровые сервисы",
  "Логистика",
  "Маркетинг и реклама",
  "Медтех",
  "Медиа и контент",
  "Онлайн-образование",
  "Промышленное ПО",
  "Телеком",
  "Туризм и travel-tech",
]

export const DEMO_SPECIALIZATIONS = [
  "Backend-разработчик",
  "DevOps-инженер",
  "Frontend-разработчик",
  "Fullstack-разработчик",
  "iOS-разработчик",
  "ML-инженер",
  "QA Automation инженер",
  "SRE-инженер",
  "UI/UX-дизайнер",
  "Android-разработчик",
  "1С-разработчик",
  "Аналитик данных",
  "Бизнес-аналитик",
  "Дата-сайентист",
  "Инженер данных",
  "Мобильный разработчик",
  "Продуктовый менеджер",
  "Проектный менеджер",
  "QA-инженер",
  "Системный аналитик",
] as const

export type WorkExperienceSeed = {
  position: string
  companyName: string
  startedAt: string
  endedAt?: string | null
  description?: string | null
}

export type CandidateProjectSeed = {
  title: string
  url?: string | null
  description?: string | null
  skillNames?: string[]
}

export type CandidateSeed = {
  key: string
  email: string
  firstName: string
  lastName: string
  patronymic?: string | null
  bornAt: string
  phoneNumber?: string | null
  tgUsername?: string | null
  description?: string | null
  education?: string | null
  githubUrl?: string | null
  gitlabUrl?: string | null
  isHidden?: boolean
  cityName?: string | null
  specializationName?: string | null
  employmentType?: TVacancyEmploymentType | null
  format?: TVacancyFormat | null
  schedule?: TVacancySchedule | null
  salaryFrom?: number | null
  salaryTo?: number | null
  skillNames?: string[]
  workExperience?: WorkExperienceSeed[]
  projects?: CandidateProjectSeed[]
  avatarLabel?: string
}

export type FunnelStepSeed = {
  name: string
  approveMessage?: string | null
  rejectMessage?: string | null
  shouldCreateCall: boolean
}

export type VacancySeed = {
  key: string
  title: string
  description?: string | null
  requirements?: string | null
  niceToHave?: string | null
  responsibilities?: string | null
  conditions?: string | null
  status?: TVacancyStatus
  salaryFrom?: number | null
  salaryTo?: number | null
  employmentType: TVacancyEmploymentType
  format: TVacancyFormat
  schedule: TVacancySchedule
  workExperience: TVacancyWorkExperience
  specializationName: string
  cityName?: string | null
  skillNames?: string[]
  funnelSteps: FunnelStepSeed[]
}

export type RecruiterSeed = {
  key: string
  email: string
  firstName: string
  lastName: string
  patronymic?: string | null
  companyName: string
  companyUrl?: string | null
  industryName: string
  logoLabel: string
  vacancies: VacancySeed[]
}

type ApplicationTimelineEvent = {
  createdAt?: string
  senderRole: TUserRole
  type: TApplicationMessageType
  content?: string | null
  meeting?: {
    stepName: string
    startsAt: string
    endsAt: string
    timezone: string
    link: string
  }
  notification?: {
    recipient: "candidate" | "recruiter"
    readAt?: string | null
  }
}

type StageResultSeed = {
  createdAt?: string
  stepName: string
  summary?: string | null
  pros?: string | null
  cons?: string | null
  notes?: string | null
  recommendation?: TApplicationStageRecommendation | null
}

export type ApplicationSeed = {
  key: string
  createdAt: string
  type: TApplicationType
  status: TApplicationStatus
  candidateKey: string
  recruiterKey: string
  vacancyKey: string
  currentStepName?: string | null
  messages: ApplicationTimelineEvent[]
  stageResults?: StageResultSeed[]
}

function lines(items: string[]) {
  return items.join("\n")
}

function vacancy(
  key: string,
  title: string,
  specializationName: string,
  cityName: string | null,
  skillNames: string[],
  options: {
    description: string[]
    requirements: string[]
    niceToHave?: string[]
    responsibilities: string[]
    conditions: string[]
    salaryFrom?: number
    salaryTo?: number
    employmentType?: TVacancyEmploymentType
    format?: TVacancyFormat
    schedule?: TVacancySchedule
    workExperience?: TVacancyWorkExperience
    status?: TVacancyStatus
    funnelSteps?: FunnelStepSeed[]
  },
): VacancySeed {
  return {
    key,
    title,
    specializationName,
    cityName,
    skillNames,
    description: lines(options.description),
    requirements: lines(options.requirements),
    niceToHave: options.niceToHave?.length ? lines(options.niceToHave) : null,
    responsibilities: lines(options.responsibilities),
    conditions: lines(options.conditions),
    salaryFrom: options.salaryFrom ?? null,
    salaryTo: options.salaryTo ?? null,
    employmentType: options.employmentType ?? VacancyEmploymentType.FullTime,
    format: options.format ?? VacancyFormat.Hybrid,
    schedule: options.schedule ?? VacancySchedule.FiveTwo,
    workExperience:
      options.workExperience ?? VacancyWorkExperience.OneToThreeYears,
    status: options.status ?? VacancyStatus.Active,
    funnelSteps: options.funnelSteps ?? DEFAULT_PRODUCT_FUNNEL,
  }
}

export const DEFAULT_PRODUCT_FUNNEL: FunnelStepSeed[] = [
  {
    name: "Интервью с рекрутером",
    approveMessage:
      "Мы внимательно изучили ваш профиль и хотим обсудить опыт, мотивацию и организационные детали.",
    rejectMessage:
      "Спасибо за интерес к вакансии. Пока мы не готовы двигаться дальше по текущему профилю.",
    shouldCreateCall: true,
  },
  {
    name: "Техническое интервью",
    approveMessage:
      "Следующий шаг — техническое интервью с командой и разбор реальных рабочих кейсов.",
    rejectMessage:
      "Спасибо за участие. На этом этапе мы выбрали кандидата с более близким техническим профилем.",
    shouldCreateCall: true,
  },
  {
    name: "Финальное интервью",
    approveMessage:
      "Вы успешно прошли предыдущие этапы. Переходим к финальной встрече с руководителем направления.",
    rejectMessage:
      "Благодарим за прохождение этапов. Решение принято в пользу другого кандидата.",
    shouldCreateCall: true,
  },
]

export const DEFAULT_ENGINEERING_FUNNEL: FunnelStepSeed[] = [
  {
    name: "Скрининг с рекрутером",
    approveMessage:
      "Хотим созвониться и сверить ожидания, формат работы и общий контекст по роли.",
    rejectMessage:
      "Спасибо за отклик. На текущем этапе мы не продолжаем процесс по этой вакансии.",
    shouldCreateCall: true,
  },
  {
    name: "Технический скрининг",
    approveMessage:
      "Переходим к короткому техническому интервью по стеку, архитектуре и практическому опыту.",
    rejectMessage:
      "Спасибо за участие в техническом скрининге. Сейчас мы не готовы продолжить процесс.",
    shouldCreateCall: true,
  },
  {
    name: "Командное интервью",
    approveMessage:
      "Финальный шаг — встреча с командой и обсуждение совместной работы на проекте.",
    rejectMessage:
      "Спасибо за уделённое время. Мы остановились на кандидате с более подходящим опытом.",
    shouldCreateCall: true,
  },
]

export const DEVOPS_FUNNEL: FunnelStepSeed[] = [
  {
    name: "Интервью с рекрутером",
    approveMessage:
      "Предлагаем обсудить команду, формат дежурств, инфраструктуру и ожидания по роли.",
    rejectMessage:
      "Спасибо за отклик. На текущем этапе мы не готовы продолжать процесс.",
    shouldCreateCall: true,
  },
  {
    name: "Техническое интервью",
    approveMessage:
      "Следующий этап — техническое интервью по Kubernetes, CI/CD, observability и инцидентам.",
    rejectMessage:
      "Спасибо за участие. Мы решили остановить процесс на этом этапе.",
    shouldCreateCall: true,
  },
  {
    name: "Архитектурный кейс",
    approveMessage:
      "Нужно обсудить проектирование инфраструктуры и устойчивость production-среды.",
    rejectMessage:
      "Спасибо за выполненный кейс. Сейчас мы не готовы сделать оффер.",
    shouldCreateCall: false,
  },
  {
    name: "Финальная встреча",
    approveMessage:
      "Финально обсудим ожидания по команде, on-call, развитию и компенсации.",
    rejectMessage:
      "Спасибо за прохождение этапов. Финальное решение принято в пользу другого кандидата.",
    shouldCreateCall: true,
  },
]

export const QA_FUNNEL: FunnelStepSeed[] = [
  {
    name: "Скрининг",
    approveMessage:
      "Хотим обсудить ваш опыт тестирования, стек и ожидания по роли.",
    rejectMessage:
      "Спасибо за интерес к вакансии. Пока мы не продолжаем процесс.",
    shouldCreateCall: true,
  },
  {
    name: "Практическое задание",
    approveMessage:
      "Просим пройти практический этап: тест-план, кейсы и базовая автоматизация.",
    rejectMessage:
      "Спасибо за выполнение задания. Пока мы не готовы двигаться дальше.",
    shouldCreateCall: false,
  },
  {
    name: "Техническое интервью",
    approveMessage:
      "Переходим к интервью с QA Lead и обсуждению процессов качества в команде.",
    rejectMessage: "Спасибо за участие. Мы остановили процесс на этом этапе.",
    shouldCreateCall: true,
  },
]

export const RECRUITERS: RecruiterSeed[] = [
  {
    key: "recruiter-demo",
    email: "recruiter@example.com",
    firstName: "Алексей",
    lastName: "Воронов",
    patronymic: "Игоревич",
    companyName: "ТехноПлатформа",
    companyUrl: "https://tech-platform.example.com",
    industryName: "Финтех",
    logoLabel: "TP",
    vacancies: [
      vacancy(
        "vac-frontend-senior",
        "Senior Frontend-разработчик (Next.js)",
        "Frontend-разработчик",
        "Москва",
        [
          "Next.js",
          "React.js",
          "TypeScript",
          "Tailwind CSS",
          "GraphQL",
          "Jest",
          "Playwright",
          "Git",
        ],
        {
          description: [
            "Ищем senior frontend-разработчика в продуктовую команду личного кабинета малого бизнеса.",
            "Команда отвечает за онбординг клиентов, платежные сценарии, аналитику и связанный self-service.",
            "Нужен инженер, который умеет проектировать интерфейсные решения, договариваться с backend-командой и держать высокую планку качества.",
          ],
          requirements: [
            "Коммерческий опыт с React.js и Next.js от 4 лет.",
            "Уверенное владение TypeScript, SSR, state management и компонентным подходом.",
            "Опыт проектирования frontend-архитектуры, код-ревью и декомпозиции задач.",
            "Понимание Web Performance, accessibility и продуктовой аналитики.",
          ],
          niceToHave: [
            "Опыт с GraphQL и Storybook.",
            "Понимание BFF-подхода и server actions.",
            "Опыт работы в финтехе или highload-продукте.",
          ],
          responsibilities: [
            "Развивать пользовательские сценарии в личном кабинете.",
            "Проектировать UI-архитектуру вместе с командой.",
            "Поддерживать тестовое покрытие и инженерные стандарты.",
            "Помогать менее опытным разработчикам.",
          ],
          conditions: [
            "Оформление по ТК РФ.",
            "Гибридный формат: 2-3 дня в офисе в Москве.",
            "ДМС, обучение, техника на выбор.",
          ],
          salaryFrom: 320000,
          salaryTo: 420000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.FromFiveYears,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-backend-middle",
        "Middle Backend-разработчик (NestJS)",
        "Backend-разработчик",
        "Москва",
        [
          "NestJS",
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "Redis",
          "RabbitMQ",
          "Docker",
          "OpenAPI",
        ],
        {
          description: [
            "Команда backend-платформы развивает сервисы авторизации, профилей и внутренних бизнес-процессов.",
            "Ищем инженера, который умеет стабильно поставлять функциональность и аккуратно работает с контрактами и данными.",
          ],
          requirements: [
            "Опыт backend-разработки от 2 лет.",
            "Практический опыт с NestJS или аналогичным framework на Node.js.",
            "Хорошее знание PostgreSQL, транзакций и проектирования API.",
            "Понимание очередей, background jobs и интеграционных контрактов.",
          ],
          niceToHave: [
            "Опыт с Kafka или RabbitMQ.",
            "Опыт проектирования модульного монолита.",
            "Навык написания интеграционных тестов.",
          ],
          responsibilities: [
            "Развивать бизнес-API и внутренние сервисы.",
            "Оптимизировать SQL-запросы и data flows.",
            "Участвовать в проектировании схем данных и очередей.",
          ],
          conditions: [
            "Полный рабочий день, гибридный формат.",
            "Сильная команда и прозрачные процессы ревью.",
          ],
          salaryFrom: 240000,
          salaryTo: 320000,
          workExperience: VacancyWorkExperience.OneToThreeYears,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-devops-middle",
        "Middle DevOps-инженер",
        "DevOps-инженер",
        "Санкт-Петербург",
        [
          "Linux",
          "Docker",
          "Kubernetes",
          "Helm",
          "Terraform",
          "GitLab CI",
          "Prometheus",
          "Grafana",
          "AWS",
        ],
        {
          description: [
            "Нужен DevOps-инженер в платформенную команду, которая поддерживает production для банковских B2B-сервисов.",
            "Основной фокус — Kubernetes, observability, надёжность релизов и автоматизация инфраструктуры.",
          ],
          requirements: [
            "От 2 лет опыта в роли DevOps/SRE.",
            "Опыт сопровождения Kubernetes-кластеров и CI/CD.",
            "Уверенная работа с Linux, Docker, сетями и метриками.",
            "Практика IaC через Terraform или аналогичный инструмент.",
          ],
          niceToHave: [
            "Опыт on-call процессов и постмортемов.",
            "Опыт с AWS и managed-сервисами.",
          ],
          responsibilities: [
            "Поддерживать и развивать Kubernetes-платформу.",
            "Автоматизировать релизы и инфраструктуру.",
            "Развивать наблюдаемость и устойчивость production.",
          ],
          conditions: [
            "Гибрид в Санкт-Петербурге или удалённо по РФ.",
            "Компенсация обучения и профильных конференций.",
          ],
          salaryFrom: 260000,
          salaryTo: 360000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.OneToThreeYears,
          funnelSteps: DEVOPS_FUNNEL,
        },
      ),
      vacancy(
        "vac-qa-auto",
        "QA Automation инженер",
        "QA Automation инженер",
        "Казань",
        [
          "Автоматизированное тестирование",
          "TypeScript",
          "Playwright",
          "Postman",
          "CI/CD",
          "Git",
        ],
        {
          description: [
            "Ищем QA Automation инженера в команду клиентских и API-сценариев.",
            "Нужен специалист, который поможет выстроить устойчивую проверку регрессии и качество релизов.",
          ],
          requirements: [
            "Опыт в автоматизации тестирования от 2 лет.",
            "Практика написания UI и API автотестов.",
            "Понимание тест-дизайна, стратегии качества и CI.",
          ],
          niceToHave: [
            "Опыт с Playwright и TypeScript.",
            "Понимание продуктовых метрик качества.",
          ],
          responsibilities: [
            "Писать и поддерживать автотесты.",
            "Развивать quality gates в CI/CD.",
            "Участвовать в анализе дефектов и стабилизации релизов.",
          ],
          conditions: [
            "Удалённый формат по РФ.",
            "ДМС после испытательного срока.",
          ],
          salaryFrom: 180000,
          salaryTo: 250000,
          format: VacancyFormat.Remote,
          workExperience: VacancyWorkExperience.OneToThreeYears,
          funnelSteps: QA_FUNNEL,
        },
      ),
      vacancy(
        "vac-data-analyst",
        "Product Data Analyst",
        "Аналитик данных",
        "Москва",
        ["SQL", "Python", "Pandas", "Power BI", "Product Management"],
        {
          description: [
            "Команда аналитики работает на стыке продукта, CRM и продаж.",
            "Нужен аналитик, который поможет командам принимать решения на основе данных и формировать понятные отчёты для бизнеса.",
          ],
          requirements: [
            "Сильный SQL и уверенный Python для аналитики.",
            "Опыт построения дашбордов и метрик продукта.",
            "Понимание A/B-подходов и воронок.",
          ],
          responsibilities: [
            "Собирать данные для продуктовых и операционных решений.",
            "Готовить дашборды и ad-hoc анализы.",
            "Выявлять узкие места в пользовательских сценариях.",
          ],
          conditions: [
            "Офис или гибрид в Москве.",
            "Влияние на продуктовые решения.",
          ],
          salaryFrom: 190000,
          salaryTo: 260000,
          format: VacancyFormat.Hybrid,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-android-middle",
        "Middle Android-разработчик",
        "Android-разработчик",
        "Новосибирск",
        ["Kotlin", "Jetpack Compose", "HTTP", "Git", "REST API"],
        {
          description: [
            "Развиваем мобильное приложение для бизнес-клиентов: платежи, документы, чат с поддержкой.",
            "Нужен Android-разработчик, который уверенно пишет на Kotlin и умеет работать с продуктовой командой.",
          ],
          requirements: [
            "Опыт Android-разработки от 2 лет.",
            "Практика с Kotlin и Jetpack Compose.",
            "Понимание клиент-серверного взаимодействия и жизненного цикла приложения.",
          ],
          responsibilities: [
            "Разрабатывать новые сценарии в Android-приложении.",
            "Поддерживать качество кода, производительность и crash-free.",
          ],
          conditions: [
            "Удалённо или офис в Новосибирске.",
            "Оплата профильного обучения.",
          ],
          salaryFrom: 220000,
          salaryTo: 300000,
          format: VacancyFormat.Remote,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-architect-1c",
        "1С-разработчик / Архитектор интеграций",
        "1С-разработчик",
        "Нижний Новгород",
        ["1С:Предприятие", "SQL", "REST API", "Системный анализ"],
        {
          description: [
            "Команда внутренней автоматизации строит интеграции между 1С, CRM и внутренними сервисами.",
            "Нужен опытный инженер, который понимает 1С и умеет проектировать интеграционный слой.",
          ],
          requirements: [
            "Коммерческий опыт с 1С от 3 лет.",
            "Понимание обменов, интеграций и SQL.",
            "Умение общаться с бизнес-заказчиком и аналитиками.",
          ],
          responsibilities: [
            "Развивать конфигурации и интеграции 1С.",
            "Участвовать в описании и реализации бизнес-процессов.",
          ],
          conditions: [
            "Гибрид в Нижнем Новгороде.",
            "Сложные интеграционные задачи и сильная команда аналитиков.",
          ],
          salaryFrom: 240000,
          salaryTo: 330000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.ThreeToFiveYears,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-sre-senior",
        "Senior SRE-инженер",
        "SRE-инженер",
        "Санкт-Петербург",
        [
          "Linux",
          "Kubernetes",
          "Prometheus",
          "Grafana",
          "Terraform",
          "Go",
          "AWS",
        ],
        {
          description: [
            "Ищем senior SRE в команду reliability, которая отвечает за отказоустойчивость ключевых клиентских сервисов.",
            "Роль для инженера, который умеет расследовать инциденты, строить SLO и улучшать архитектуру сервисов.",
          ],
          requirements: [
            "Опыт в SRE/DevOps от 5 лет.",
            "Глубокое понимание Linux, Kubernetes и observability.",
            "Практика incident response, postmortem и capacity planning.",
          ],
          responsibilities: [
            "Развивать надёжность и операционную зрелость сервисов.",
            "Участвовать в сложных инцидентах и встраивать lessons learned в платформу.",
          ],
          conditions: [
            "Удалённо по РФ, командировки в офис по необходимости.",
            "Расширенный пакет ДМС и бонусная программа.",
          ],
          salaryFrom: 360000,
          salaryTo: 470000,
          format: VacancyFormat.Remote,
          workExperience: VacancyWorkExperience.FromFiveYears,
          funnelSteps: DEVOPS_FUNNEL,
        },
      ),
      vacancy(
        "vac-fullstack-middle",
        "Middle Fullstack-разработчик",
        "Fullstack-разработчик",
        "Иваново",
        ["Next.js", "React.js", "TypeScript", "NestJS", "PostgreSQL", "Docker"],
        {
          description: [
            "Команда внутренних продуктов ищет fullstack-инженера для развития сервисов управления наймом и внутренних кабинетов.",
            "Роль хорошо подходит тем, кто любит видеть продукт целиком и брать задачи от UI до backend.",
          ],
          requirements: [
            "Опыт fullstack-разработки от 2 лет.",
            "Практика работы с React/Next.js и Node.js/NestJS.",
            "Умение самостоятельно доводить фичу до production.",
          ],
          responsibilities: [
            "Развивать пользовательские сценарии на frontend и backend.",
            "Поддерживать качество API, схем и UX-потока.",
          ],
          conditions: [
            "Гибрид или удалённо с возможностью иногда приезжать в Иваново.",
            "Быстрые релизы и компактная команда.",
          ],
          salaryFrom: 210000,
          salaryTo: 290000,
          format: VacancyFormat.Hybrid,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-system-analyst",
        "Middle системный аналитик",
        "Системный аналитик",
        "Москва",
        ["Системный анализ", "BPMN", "UML", "SQL", "REST API"],
        {
          description: [
            "Нужен системный аналитик в команду процессов найма и CRM-сервисов.",
            "Важно уметь формализовывать требования, описывать интеграции и держать единое понимание между продуктом и разработкой.",
          ],
          requirements: [
            "Опыт в системном анализе от 2 лет.",
            "Понимание интеграционных API, SQL и моделирования процессов.",
            "Умение писать понятные постановки и работать с разработчиками.",
          ],
          responsibilities: [
            "Собирать и структурировать требования.",
            "Проектировать интеграции и схемы взаимодействия.",
            "Поддерживать спецификации в актуальном состоянии.",
          ],
          conditions: [
            "Офис в Москве, 1-2 дня гибрида в неделю.",
            "Работа в связке с сильной продуктовой командой.",
          ],
          salaryFrom: 180000,
          salaryTo: 250000,
          format: VacancyFormat.Hybrid,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-data-engineer",
        "Инженер данных",
        "Инженер данных",
        "Москва",
        [
          "Python",
          "SQL",
          "Apache Airflow",
          "Apache Spark",
          "PostgreSQL",
          "ClickHouse",
          "dbt",
        ],
        {
          description: [
            "Команда данных строит витрины, pipeline и продуктовую аналитику для нескольких направлений компании.",
            "Нужен инженер, который умеет собирать устойчивые data flows и следит за качеством данных.",
          ],
          requirements: [
            "Опыт в data engineering от 2 лет.",
            "Python, SQL, orchestration и работа с хранилищами.",
            "Понимание модели данных и мониторинга pipeline.",
          ],
          responsibilities: [
            "Разрабатывать и поддерживать ETL/ELT-процессы.",
            "Строить витрины и следить за качеством данных.",
          ],
          conditions: [
            "Удалённо или офис в Москве.",
            "Сильная data-команда и реальные продуктовые задачи.",
          ],
          salaryFrom: 240000,
          salaryTo: 340000,
          format: VacancyFormat.Remote,
          workExperience: VacancyWorkExperience.OneToThreeYears,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-product-manager",
        "Продуктовый менеджер B2B",
        "Продуктовый менеджер",
        "Москва",
        ["Product Management", "Product Discovery", "SQL", "Agile"],
        {
          description: [
            "Ищем product manager в B2B-направление, которое отвечает за воронку продаж и самообслуживание клиентов.",
            "Роль для человека, который умеет разговаривать с бизнесом, пользователями и командой разработки на одном языке.",
          ],
          requirements: [
            "Опыт продуктовой работы от 3 лет.",
            "Умение работать с метриками, гипотезами и customer development.",
            "Навык постановки задач и приоритизации бэклога.",
          ],
          responsibilities: [
            "Отвечать за discovery и delivery в продуктовой зоне.",
            "Формировать и валидировать гипотезы.",
            "Держать roadmap и работать с командой delivery.",
          ],
          conditions: [
            "Офис в Москве, гибридный режим.",
            "Прямая коммуникация с бизнесом и руководством.",
          ],
          salaryFrom: 260000,
          salaryTo: 360000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.ThreeToFiveYears,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-frontend-archived",
        "Frontend-разработчик (архив)",
        "Frontend-разработчик",
        "Казань",
        ["React.js", "TypeScript", "CSS", "Jest"],
        {
          description: [
            "Архивная вакансия для демонстрации жизненного цикла публикации и завершения найма.",
          ],
          requirements: [
            "Опыт коммерческой frontend-разработки от 1 года.",
            "Уверенное владение React.js и TypeScript.",
          ],
          responsibilities: ["Поддержка интерфейсов внутренних сервисов."],
          conditions: ["Полный рабочий день."],
          salaryFrom: 150000,
          salaryTo: 210000,
          format: VacancyFormat.Remote,
          workExperience: VacancyWorkExperience.UpToYear,
          status: VacancyStatus.Archived,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
    ],
  },
  {
    key: "recruiter-finverse",
    email: "elena.karpova@example.com",
    firstName: "Елена",
    lastName: "Карпова",
    patronymic: "Андреевна",
    companyName: "Финверс Лабс",
    companyUrl: "https://finverse-labs.example.com",
    industryName: "Электронная коммерция",
    logoLabel: "FL",
    vacancies: [
      vacancy(
        "vac-ios-senior",
        "Senior iOS-разработчик",
        "iOS-разработчик",
        "Санкт-Петербург",
        ["Swift", "SwiftUI", "HTTP", "REST API", "Git"],
        {
          description: [
            "Мобильная команда развивает iOS-приложение для B2C-платформы с миллионами пользователей.",
            "Нужен опытный iOS-инженер, который умеет проектировать архитектуру и выстраивать инженерное качество.",
          ],
          requirements: [
            "Опыт iOS-разработки от 4 лет.",
            "Сильный Swift и практика со SwiftUI.",
            "Понимание архитектурных паттернов и мобильной производительности.",
          ],
          responsibilities: [
            "Развивать ключевые пользовательские сценарии на iOS.",
            "Участвовать в архитектурных решениях и ревью кода.",
          ],
          conditions: [
            "Гибрид в Санкт-Петербурге.",
            "Продукт с большой пользовательской базой.",
          ],
          salaryFrom: 320000,
          salaryTo: 430000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.FromFiveYears,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-backend-java",
        "Senior Backend-разработчик (Java / Spring Boot)",
        "Backend-разработчик",
        "Екатеринбург",
        [
          "Java",
          "Spring Boot",
          "Spring Framework",
          "Hibernate",
          "PostgreSQL",
          "Apache Kafka",
          "Docker",
        ],
        {
          description: [
            "Команда core-сервисов развивает каталог, заказы и коммуникацию с внешними поставщиками.",
            "Нужен senior backend-инженер с опытом высоконагруженных систем и событийной архитектуры.",
          ],
          requirements: [
            "Опыт backend-разработки на Java от 5 лет.",
            "Практика со Spring Boot, PostgreSQL и Kafka.",
            "Понимание транзакционности, конкуренции и профилирования.",
          ],
          responsibilities: [
            "Разрабатывать и оптимизировать core-сервисы.",
            "Участвовать в архитектурных решениях и разборе инцидентов.",
          ],
          conditions: [
            "Удалённо или офис в Екатеринбурге.",
            "Высоконагруженный продукт и зрелые процессы разработки.",
          ],
          salaryFrom: 340000,
          salaryTo: 450000,
          format: VacancyFormat.Remote,
          workExperience: VacancyWorkExperience.FromFiveYears,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-ml-engineer",
        "ML-инженер",
        "ML-инженер",
        "Москва",
        [
          "Python",
          "Machine Learning",
          "Deep Learning",
          "Pandas",
          "NumPy",
          "MLOps",
          "Docker",
        ],
        {
          description: [
            "Команда рекомендаций строит модели ранжирования и персонализации контента.",
            "Нужен ML Engineer, который умеет не только обучать модели, но и доводить их до production.",
          ],
          requirements: [
            "Опыт разработки ML-решений от 2 лет.",
            "Сильный Python, работа с данными и ML-библиотеками.",
            "Понимание production lifecycle моделей и MLOps-практик.",
          ],
          responsibilities: [
            "Развивать модели ранжирования и рекомендательные сценарии.",
            "Готовить пайплайны обучения и деплоя.",
          ],
          conditions: [
            "Гибрид в Москве или удалённо.",
            "Реальные production-модели и большая пользовательская база.",
          ],
          salaryFrom: 280000,
          salaryTo: 380000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.OneToThreeYears,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-ui-ux",
        "Senior UI/UX-дизайнер",
        "UI/UX-дизайнер",
        "Москва",
        ["Figma", "UI/UX Design", "Product Discovery"],
        {
          description: [
            "Ищем senior designer в продуктовую команду mobile + web.",
            "Важно уметь вести задачу от discovery до handoff, думать не только про красоту, но и про метрики.",
          ],
          requirements: [
            "Сильное портфолио продуктовых интерфейсов.",
            "Опыт проектирования сложных пользовательских сценариев.",
            "Уверенное владение Figma и системным подходом к дизайну.",
          ],
          responsibilities: [
            "Проектировать пользовательские сценарии и UI.",
            "Проводить исследования и валидировать решения с product-командой.",
          ],
          conditions: [
            "Гибрид в Москве.",
            "Возможность влиять на дизайн-систему продукта.",
          ],
          salaryFrom: 230000,
          salaryTo: 320000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.ThreeToFiveYears,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-go-backend",
        "Middle Backend-разработчик (Go)",
        "Backend-разработчик",
        "Казань",
        ["Go", "PostgreSQL", "Docker", "REST API", "gRPC"],
        {
          description: [
            "Команда заказов строит сервисы на Go с фокусом на скорость и масштабирование.",
            "Нужен инженер, который уверенно пишет backend, понимает API и не боится разбираться в инфраструктуре.",
          ],
          requirements: [
            "Опыт разработки на Go от 2 лет.",
            "Хорошее знание SQL и сетевых протоколов.",
            "Понимание конкурентности и observability.",
          ],
          responsibilities: [
            "Развивать backend-сервисы на Go.",
            "Поддерживать стабильность, метрики и документацию API.",
          ],
          conditions: ["Удалённо или офис в Казани."],
          salaryFrom: 230000,
          salaryTo: 310000,
          format: VacancyFormat.Remote,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-qa-manual",
        "Middle QA-инженер",
        "QA-инженер",
        "Самара",
        ["QA", "Ручное тестирование", "Postman", "TestRail"],
        {
          description: [
            "Ищем QA Engineer в команду checkout и платежей.",
            "Роль ориентирована на вдумчивую ручную проверку, тест-дизайн и участие в релизном процессе.",
          ],
          requirements: [
            "Опыт ручного тестирования web/API от 2 лет.",
            "Понимание жизненного цикла дефекта и тестовой документации.",
          ],
          responsibilities: [
            "Подготавливать тестовые сценарии и проводить регрессию.",
            "Работать с разработчиками над воспроизведением и устранением дефектов.",
          ],
          conditions: ["Гибрид в Самаре."],
          salaryFrom: 130000,
          salaryTo: 180000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.OneToThreeYears,
          funnelSteps: QA_FUNNEL,
        },
      ),
      vacancy(
        "vac-project-manager",
        "IT проектный менеджер",
        "Проектный менеджер",
        "Ростов-на-Дону",
        ["Agile", "Scrum", "Kanban", "Product Management"],
        {
          description: [
            "Нужен project manager в delivery-команду, которая координирует несколько продуктовых потоков и интеграций.",
          ],
          requirements: [
            "Опыт управления IT-проектами от 3 лет.",
            "Практика с Agile-процессами и delivery-планированием.",
            "Навык синхронизации нескольких команд и стейкхолдеров.",
          ],
          responsibilities: [
            "Планировать поставку задач и управлять рисками.",
            "Следить за сроками, зависимостями и прозрачностью статуса проекта.",
          ],
          conditions: ["Удалённо по РФ."],
          salaryFrom: 180000,
          salaryTo: 250000,
          format: VacancyFormat.Remote,
          workExperience: VacancyWorkExperience.ThreeToFiveYears,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-system-analyst-finverse",
        "Senior системный аналитик",
        "Системный аналитик",
        "Санкт-Петербург",
        ["Системный анализ", "BPMN", "UML", "SQL", "REST API"],
        {
          description: [
            "Команда платформы ищет senior analyst для сложных интеграций между витринами, заказами и платежами.",
          ],
          requirements: [
            "Опыт системного анализа от 4 лет.",
            "Глубокое понимание API-контрактов и схем данных.",
          ],
          responsibilities: [
            "Формализовывать требования и описывать интеграционные контракты.",
            "Поддерживать единое понимание между продуктом и инженерной командой.",
          ],
          conditions: ["Гибрид в Санкт-Петербурге."],
          salaryFrom: 230000,
          salaryTo: 320000,
          format: VacancyFormat.Hybrid,
          workExperience: VacancyWorkExperience.ThreeToFiveYears,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
      vacancy(
        "vac-data-scientist",
        "Дата-сайентист",
        "Дата-сайентист",
        "Москва",
        ["Python", "Machine Learning", "Pandas", "NumPy", "SQL"],
        {
          description: [
            "Команда антифрода ищет data scientist для задач скоринга и аномалий.",
          ],
          requirements: [
            "Опыт прикладного ML от 2 лет.",
            "Сильный Python и умение объяснять бизнес-ценность модели.",
          ],
          responsibilities: [
            "Строить, валидировать и улучшать ML-модели.",
            "Работать в тесной связке с data engineering и продуктом.",
          ],
          conditions: ["Гибрид в Москве."],
          salaryFrom: 250000,
          salaryTo: 340000,
          format: VacancyFormat.Hybrid,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-mobile-react-native",
        "React Native разработчик",
        "Мобильный разработчик",
        "Краснодар",
        ["React Native", "Expo", "TypeScript", "REST API"],
        {
          description: [
            "Нужен mobile engineer для развития кроссплатформенного приложения лояльности и личного кабинета.",
          ],
          requirements: [
            "Опыт React Native от 2 лет.",
            "Уверенный TypeScript и понимание mobile release cycle.",
          ],
          responsibilities: [
            "Разрабатывать новые mobile-сценарии и держать качество релизов.",
          ],
          conditions: ["Удалённо по РФ."],
          salaryFrom: 210000,
          salaryTo: 290000,
          format: VacancyFormat.Remote,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-php-backend",
        "PHP Backend-разработчик (Laravel)",
        "Backend-разработчик",
        "Воронеж",
        ["PHP", "Laravel", "MySQL", "REST API", "Docker"],
        {
          description: [
            "Команда внутренних сервисов и CMS ищет backend-разработчика под Laravel.",
          ],
          requirements: [
            "Коммерческий опыт с PHP и Laravel от 2 лет.",
            "Практика с SQL, очередями и интеграциями.",
          ],
          responsibilities: [
            "Разрабатывать и поддерживать backend-сервисы и административные модули.",
          ],
          conditions: ["Гибрид в Воронеже."],
          salaryFrom: 170000,
          salaryTo: 240000,
          format: VacancyFormat.Hybrid,
          funnelSteps: DEFAULT_ENGINEERING_FUNNEL,
        },
      ),
      vacancy(
        "vac-uiux-archived",
        "UI/UX-дизайнер (архив)",
        "UI/UX-дизайнер",
        "Москва",
        ["Figma", "UI/UX Design"],
        {
          description: [
            "Архивная вакансия для демонстрации статуса archived и истории откликов.",
          ],
          requirements: ["Опыт продуктового дизайна от 2 лет."],
          responsibilities: [
            "Проектирование web-интерфейсов и подготовка handoff.",
          ],
          conditions: ["Гибрид в Москве."],
          salaryFrom: 160000,
          salaryTo: 220000,
          format: VacancyFormat.Hybrid,
          status: VacancyStatus.Archived,
          funnelSteps: DEFAULT_PRODUCT_FUNNEL,
        },
      ),
    ],
  },
]

export const CANDIDATES: CandidateSeed[] = [
  {
    key: "candidate-demo",
    email: "candidate@example.com",
    firstName: "Мария",
    lastName: "Соколова",
    patronymic: "Алексеевна",
    bornAt: "1995-04-18T00:00:00.000Z",
    phoneNumber: "+7 910 123-45-67",
    tgUsername: "@maria_sokolova_dev",
    description: lines([
      "Senior frontend-разработчик с 8+ годами опыта в продуктовых командах.",
      "Специализируюсь на React/Next.js, проектировании интерфейсной архитектуры, performance и UX-ориентированной разработке.",
      "Последние годы работаю на стыке продуктовой разработки, дизайн-систем и mentoring внутри команды.",
    ]),
    education:
      "Ивановский государственный энергетический университет, прикладная информатика",
    githubUrl: "https://github.com/maria-sokolova",
    gitlabUrl: "https://gitlab.com/maria-sokolova",
    cityName: "Иваново",
    specializationName: "Frontend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 320000,
    salaryTo: 380000,
    skillNames: [
      "Next.js",
      "React.js",
      "TypeScript",
      "Tailwind CSS",
      "GraphQL",
      "Jest",
      "Playwright",
      "Storybook",
      "Figma",
    ],
    workExperience: [
      {
        position: "Senior Frontend Developer",
        companyName: "Т-Банк",
        startedAt: "2022-02-01T00:00:00.000Z",
        description:
          "Развивала B2B-кабинет для корпоративных клиентов: платежи, роли, документооборот. Отвечала за архитектуру frontend-слоя, SSR на Next.js, performance, code review и развитие дизайн-системы.",
      },
      {
        position: "Middle Frontend Developer",
        companyName: "Яндекс Практикум",
        startedAt: "2019-05-01T00:00:00.000Z",
        endedAt: "2022-01-31T00:00:00.000Z",
        description:
          "Работала над продуктами обучения и личными кабинетами студентов, внедряла TypeScript, Storybook и e2e-проверки. Плотно взаимодействовала с аналитиками и дизайнерами.",
      },
      {
        position: "Frontend-разработчик",
        companyName: "Aston",
        startedAt: "2017-06-01T00:00:00.000Z",
        endedAt: "2019-04-30T00:00:00.000Z",
        description:
          "Участвовала в разработке внутренних веб-продуктов для клиентов из e-commerce и telecom. Писала SPA на React.js, поддерживала legacy-код и миграции на современный стек.",
      },
    ],
    projects: [
      {
        title: "B2B Hiring Console",
        url: "https://github.com/maria-sokolova/hiring-console",
        description:
          "Полноценный интерфейс для управления вакансиями и воронкой найма на Next.js 14. Реализовала SSR, фильтры, state management, form architecture и e2e-покрытие ключевых сценариев.",
        skillNames: [
          "Next.js",
          "React.js",
          "TypeScript",
          "Tailwind CSS",
          "Playwright",
        ],
      },
      {
        title: "Design System Playground",
        url: "https://github.com/maria-sokolova/design-system-playground",
        description:
          "Песочница для развития дизайн-системы с Storybook, токенами, доступностью и документацией для продуктовых команд.",
        skillNames: ["React.js", "TypeScript", "Storybook", "CSS"],
      },
      {
        title: "Realtime Analytics Dashboard",
        url: "https://github.com/maria-sokolova/realtime-dashboard",
        description:
          "Веб-приложение для визуализации продуктовых метрик и событий в реальном времени с поддержкой графиков, фильтров и серверного рендеринга.",
        skillNames: ["Next.js", "GraphQL", "TypeScript", "React.js"],
      },
    ],
    avatarLabel: "MS",
  },
  {
    key: "candidate-backend-senior",
    email: "ivan.petrov@example.com",
    firstName: "Иван",
    lastName: "Петров",
    patronymic: "Сергеевич",
    bornAt: "1991-11-06T00:00:00.000Z",
    phoneNumber: "+7 999 340-22-11",
    tgUsername: "@petrov_backend",
    description:
      "Senior backend-разработчик с сильным опытом на Java и Node.js. Проектировал сервисы каталогов, биллинга и интеграционные платформы.",
    education:
      "Санкт-Петербургский политехнический университет Петра Великого, программная инженерия",
    githubUrl: "https://github.com/ivan-petrov",
    cityName: "Санкт-Петербург",
    specializationName: "Backend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 360000,
    salaryTo: 450000,
    skillNames: [
      "Java",
      "Spring Boot",
      "Spring Framework",
      "Hibernate",
      "PostgreSQL",
      "Apache Kafka",
      "Docker",
      "Kubernetes",
      "OpenAPI",
    ],
    workExperience: [
      {
        position: "Senior Backend Developer",
        companyName: "Ozon",
        startedAt: "2021-03-01T00:00:00.000Z",
        description:
          "Разрабатывал высоконагруженные сервисы заказов и интеграции с внешними поставщиками. Отвечал за архитектурные решения, профилирование, транзакционность и event-driven взаимодействия.",
      },
      {
        position: "Backend-разработчик",
        companyName: "Сбер",
        startedAt: "2017-02-01T00:00:00.000Z",
        endedAt: "2021-02-28T00:00:00.000Z",
        description:
          "Работал над внутренними банковскими сервисами, писал REST API, оптимизировал SQL и участвовал в переходе на микросервисную архитектуру.",
      },
    ],
    projects: [
      {
        title: "Event Gateway",
        url: "https://github.com/ivan-petrov/event-gateway",
        description:
          "Сервис маршрутизации событий на Java/Spring Boot с поддержкой Kafka, retry-механизмов, observability и outbox-паттерна.",
        skillNames: ["Java", "Spring Boot", "Apache Kafka", "PostgreSQL"],
      },
      {
        title: "API Contracts Kit",
        url: "https://github.com/ivan-petrov/api-contracts-kit",
        description:
          "Набор практик и шаблонов для работы с OpenAPI, versioning и интеграционными контрактами между командами.",
        skillNames: ["OpenAPI", "REST API", "Java"],
      },
    ],
    avatarLabel: "ИП",
  },
  {
    key: "candidate-devops-middle",
    email: "denis.orlov@example.com",
    firstName: "Денис",
    lastName: "Орлов",
    patronymic: "Павлович",
    bornAt: "1994-07-09T00:00:00.000Z",
    phoneNumber: "+7 921 700-19-44",
    tgUsername: "@denis_devops",
    description:
      "Middle DevOps Engineer. Сопровождаю Kubernetes-кластеры, строю CI/CD и развиваю наблюдаемость production-среды.",
    education: "ИТМО, программная инженерия",
    cityName: "Санкт-Петербург",
    specializationName: "DevOps-инженер",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 250000,
    salaryTo: 320000,
    skillNames: [
      "Linux",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "GitLab CI",
      "Prometheus",
      "Grafana",
      "AWS",
    ],
    workExperience: [
      {
        position: "DevOps-инженер",
        companyName: "VK",
        startedAt: "2022-06-01T00:00:00.000Z",
        description:
          "Поддерживаю production-кластеры, автоматизирую релизы, развиваю monitoring и logging. Участвую в on-call и постмортемах.",
      },
      {
        position: "Systems Engineer",
        companyName: "Selectel",
        startedAt: "2020-01-01T00:00:00.000Z",
        endedAt: "2022-05-31T00:00:00.000Z",
        description:
          "Администрировал Linux-сервера, писал automation для развёртывания сервисов и занимался сетевыми задачами.",
      },
    ],
    projects: [
      {
        title: "Observability Blueprint",
        description:
          "Пример production-ready набора мониторинга на Prometheus и Grafana с алертингом, dashboard и runbook-подходом.",
        skillNames: ["Prometheus", "Grafana", "Kubernetes", "Linux"],
      },
    ],
    avatarLabel: "ДО",
  },
  {
    key: "candidate-data-engineer",
    email: "olga.kuznetsova@example.com",
    firstName: "Ольга",
    lastName: "Кузнецова",
    patronymic: "Михайловна",
    bornAt: "1993-03-27T00:00:00.000Z",
    phoneNumber: "+7 903 411-20-18",
    tgUsername: "@olga_data",
    description:
      "Data Engineer с опытом построения витрин, orchestration pipeline и продуктовой аналитики.",
    education: "МГУ, прикладная математика и информатика",
    cityName: "Москва",
    specializationName: "Инженер данных",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 260000,
    salaryTo: 340000,
    skillNames: [
      "Python",
      "SQL",
      "Apache Airflow",
      "Apache Spark",
      "ClickHouse",
      "dbt",
      "PostgreSQL",
    ],
    workExperience: [
      {
        position: "Инженер данных",
        companyName: "Авито",
        startedAt: "2021-09-01T00:00:00.000Z",
        description:
          "Проектировала и поддерживала ETL/ELT-процессы, витрины для аналитики и SLA по качеству данных.",
      },
      {
        position: "BI Developer",
        companyName: "X5 Tech",
        startedAt: "2018-04-01T00:00:00.000Z",
        endedAt: "2021-08-31T00:00:00.000Z",
        description:
          "Работала с DWH, SQL-витринами, отчётами и коммуникацией с бизнес-пользователями.",
      },
    ],
    projects: [
      {
        title: "Retail DWH Demo",
        description:
          "Демо-хранилище с оркестрацией на Airflow, витринами в ClickHouse и transformations через dbt.",
        skillNames: ["Apache Airflow", "ClickHouse", "dbt", "SQL"],
      },
    ],
  },
  {
    key: "candidate-ios-senior",
    email: "anna.volkova@example.com",
    firstName: "Анна",
    lastName: "Волкова",
    patronymic: "Игоревна",
    bornAt: "1992-01-12T00:00:00.000Z",
    phoneNumber: "+7 915 888-40-12",
    tgUsername: "@annav_ios",
    description:
      "Senior iOS Developer, развивала B2C и B2B мобильные приложения, люблю архитектуру, UX и стабильные релизы.",
    education: "СПбГУ, матмех",
    githubUrl: "https://github.com/anna-volkova",
    cityName: "Санкт-Петербург",
    specializationName: "iOS-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 330000,
    salaryTo: 410000,
    skillNames: ["Swift", "SwiftUI", "REST API", "Git", "UI/UX Design"],
    workExperience: [
      {
        position: "Senior iOS Developer",
        companyName: "Самокат",
        startedAt: "2021-01-01T00:00:00.000Z",
        description:
          "Разрабатывала пользовательские сценарии оформления заказов и доставки, участвовала в развитии архитектуры приложения и менторинге команды.",
      },
      {
        position: "iOS-разработчик",
        companyName: "Surf",
        startedAt: "2017-07-01T00:00:00.000Z",
        endedAt: "2020-12-31T00:00:00.000Z",
        description:
          "Делала мобильные продукты для клиентов из retail и finance, от discovery до публикации и поддержки.",
      },
    ],
    projects: [
      {
        title: "Expense Tracker iOS",
        url: "https://github.com/anna-volkova/expense-tracker-ios",
        description:
          "Приложение учёта расходов на SwiftUI с offline-режимом, удобным onboarding и акцентом на UX.",
        skillNames: ["Swift", "SwiftUI", "UI/UX Design"],
      },
    ],
    avatarLabel: "АВ",
  },
  {
    key: "candidate-qa-auto",
    email: "sergey.morozov@example.com",
    firstName: "Сергей",
    lastName: "Морозов",
    patronymic: "Олегович",
    bornAt: "1996-09-14T00:00:00.000Z",
    phoneNumber: "+7 926 700-17-03",
    tgUsername: "@sergqa",
    description:
      "QA Automation инженер, строю UI и API автотесты, люблю понятные quality gates и предсказуемые релизы.",
    education: "КФУ, прикладная информатика",
    cityName: "Казань",
    specializationName: "QA Automation инженер",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 180000,
    salaryTo: 240000,
    skillNames: [
      "Автоматизированное тестирование",
      "TypeScript",
      "Playwright",
      "Postman",
      "CI/CD",
      "Git",
    ],
    workExperience: [
      {
        position: "QA Automation инженер",
        companyName: "Контур",
        startedAt: "2022-04-01T00:00:00.000Z",
        description:
          "Построил e2e- и API-проверки для web-продуктов, интегрировал quality gates в CI/CD и помогал команде стабилизировать регрессию.",
      },
      {
        position: "QA-инженер",
        companyName: "Ак Барс Цифровые Технологии",
        startedAt: "2020-03-01T00:00:00.000Z",
        endedAt: "2022-03-31T00:00:00.000Z",
        description:
          "Занимался ручным и API-тестированием, писал тестовую документацию и проводил smoke/regression перед релизами.",
      },
    ],
    projects: [
      {
        title: "E2E Framework Starter",
        description:
          "Шаблон тестового проекта на Playwright с фикстурами, page objects и отчётами для CI.",
        skillNames: ["Playwright", "TypeScript", "CI/CD"],
      },
    ],
    avatarLabel: "СМ",
  },
  {
    key: "candidate-frontend-junior",
    email: "kirill.smolin@example.com",
    firstName: "Кирилл",
    lastName: "Смолин",
    bornAt: "2001-08-21T00:00:00.000Z",
    phoneNumber: "+7 901 301-55-22",
    tgUsername: "@kirill_front",
    description:
      "Junior frontend-разработчик. Ищу первую сильную продуктовую команду, готов быстро расти и брать обратную связь.",
    education:
      "Ивановский государственный университет, прикладная математика и информатика",
    cityName: "Иваново",
    specializationName: "Frontend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 90000,
    salaryTo: 130000,
    skillNames: ["React.js", "TypeScript", "HTML", "CSS", "Git"],
    workExperience: [],
    projects: [
      {
        title: "Pet Dashboard",
        url: "https://github.com/kirill-smolin/pet-dashboard",
        description:
          "Учебный проект дашборда на React.js и TypeScript с таблицами, фильтрами и формами.",
        skillNames: ["React.js", "TypeScript", "HTML", "CSS"],
      },
    ],
  },
  {
    key: "candidate-backend-junior",
    email: "pavel.egorov@example.com",
    firstName: "Павел",
    lastName: "Егоров",
    bornAt: "2000-10-03T00:00:00.000Z",
    phoneNumber: "+7 905 771-80-40",
    cityName: "Ярославль",
    specializationName: "Backend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 100000,
    salaryTo: 140000,
    skillNames: ["Node.js", "NestJS", "TypeScript", "PostgreSQL", "Docker"],
    description:
      "Junior backend-разработчик после стажировки. Хочу развиваться в сторону backend и API.",
    workExperience: [
      {
        position: "Backend Intern",
        companyName: "SimbirSoft",
        startedAt: "2024-06-01T00:00:00.000Z",
        endedAt: "2024-09-30T00:00:00.000Z",
        description:
          "Делал небольшие backend-задачи, писал CRUD API и unit-тесты под наставничеством.",
      },
    ],
    projects: [
      {
        title: "Task API",
        description:
          "Небольшой сервис задач на NestJS с PostgreSQL, авторизацией и документацией OpenAPI.",
        skillNames: ["NestJS", "TypeScript", "PostgreSQL", "OpenAPI"],
      },
    ],
    avatarLabel: "ПЕ",
  },
  {
    key: "candidate-mobile-middle",
    email: "roman.fedorov@example.com",
    firstName: "Роман",
    lastName: "Фёдоров",
    bornAt: "1997-12-22T00:00:00.000Z",
    cityName: "Новосибирск",
    specializationName: "Android-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 210000,
    salaryTo: 270000,
    skillNames: ["Kotlin", "Jetpack Compose", "REST API", "Git"],
    description:
      "Middle Android Developer, люблю прикладные продуктовые задачи и аккуратную архитектуру.",
    workExperience: [
      {
        position: "Android-разработчик",
        companyName: "2ГИС",
        startedAt: "2022-01-01T00:00:00.000Z",
        description:
          "Разрабатываю пользовательские сценарии мобильного приложения, работаю с product-командой и улучшением производительности.",
      },
    ],
    projects: [
      {
        title: "Travel Planner",
        description:
          "Android-приложение для планирования поездок на Kotlin и Jetpack Compose.",
        skillNames: ["Kotlin", "Jetpack Compose"],
      },
    ],
  },
  {
    key: "candidate-analyst-middle",
    email: "irina.zaitseva@example.com",
    firstName: "Ирина",
    lastName: "Зайцева",
    bornAt: "1995-05-11T00:00:00.000Z",
    cityName: "Москва",
    specializationName: "Системный аналитик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 190000,
    salaryTo: 250000,
    skillNames: ["Системный анализ", "BPMN", "UML", "SQL", "REST API"],
    description:
      "System Analyst с опытом в банковских и e-commerce проектах. Сильна в интеграциях и формализации сложных процессов.",
    workExperience: [
      {
        position: "Системный аналитик",
        companyName: "Райффайзен Банк",
        startedAt: "2021-05-01T00:00:00.000Z",
        description:
          "Описываю API и бизнес-процессы, поддерживаю синхронизацию между продуктом и разработкой, участвую в приоритизации бэклога.",
      },
    ],
    projects: [
      {
        title: "Integration Catalogue",
        description:
          "Набор схем и API-контрактов для внутренних интеграций с упором на прозрачность и поддерживаемость.",
        skillNames: ["Системный анализ", "REST API", "UML"],
      },
    ],
    avatarLabel: "ИЗ",
  },
  {
    key: "candidate-designer-middle",
    email: "sofia.lebedeva@example.com",
    firstName: "София",
    lastName: "Лебедева",
    bornAt: "1998-06-17T00:00:00.000Z",
    cityName: "Москва",
    specializationName: "UI/UX-дизайнер",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 160000,
    salaryTo: 220000,
    skillNames: ["Figma", "UI/UX Design", "Product Discovery"],
    description:
      "UI/UX Designer. Проектирую интерфейсы для web и mobile, умею работать с исследованиями и handoff.",
    workExperience: [
      {
        position: "Product Designer",
        companyName: "Лаборатория Касперского",
        startedAt: "2022-03-01T00:00:00.000Z",
        description:
          "Разрабатываю интерфейсы внутренних сервисов и внешних личных кабинетов, участвую в исследованиях и user testing.",
      },
    ],
    projects: [
      {
        title: "B2B CRM Redesign",
        description:
          "Концепт редизайна CRM-интерфейса с новым navigation pattern, онбордингом и UI kit.",
        skillNames: ["Figma", "UI/UX Design"],
      },
    ],
    avatarLabel: "СЛ",
  },
  {
    key: "candidate-product",
    email: "nikita.gromov@example.com",
    firstName: "Никита",
    lastName: "Громов",
    bornAt: "1990-02-25T00:00:00.000Z",
    cityName: "Москва",
    specializationName: "Продуктовый менеджер",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 260000,
    salaryTo: 340000,
    skillNames: ["Product Management", "Product Discovery", "SQL", "Agile"],
    description:
      "Product manager с опытом в B2B SaaS и внутренних продуктах. Сильный в discovery, приоритизации и delivery.",
    workExperience: [
      {
        position: "Продуктовый менеджер",
        companyName: "МТС",
        startedAt: "2021-07-01T00:00:00.000Z",
        description:
          "Отвечаю за продуктовые метрики, roadmap и взаимодействие между бизнесом, аналитикой и разработкой.",
      },
    ],
    projects: [
      {
        title: "Activation Funnel Revamp",
        description:
          "Продуктовая инициатива по улучшению activation-воронки и сокращению time-to-value для новых пользователей.",
        skillNames: ["Product Management", "Product Discovery", "SQL"],
      },
    ],
  },
  {
    key: "candidate-ml",
    email: "alina.mironova@example.com",
    firstName: "Алина",
    lastName: "Миронова",
    bornAt: "1996-04-05T00:00:00.000Z",
    cityName: "Москва",
    specializationName: "ML-инженер",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 260000,
    salaryTo: 330000,
    skillNames: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "Pandas",
      "NumPy",
      "MLOps",
    ],
    description:
      "ML Engineer с опытом production-моделей, пайплайнов обучения и выкладки моделей в сервисы.",
    workExperience: [
      {
        position: "ML-инженер",
        companyName: "VK",
        startedAt: "2022-01-01T00:00:00.000Z",
        description:
          "Работаю над моделями рекомендаций, feature pipeline и мониторингом качества модели в production.",
      },
    ],
    projects: [
      {
        title: "Ranking Model Pipeline",
        description:
          "Демо production-пайплайна обучения и доставки модели ранжирования с упором на воспроизводимость и мониторинг.",
        skillNames: ["Machine Learning", "MLOps", "Python"],
      },
    ],
  },
  {
    key: "candidate-fullstack-middle",
    email: "maksim.dmitriev@example.com",
    firstName: "Максим",
    lastName: "Дмитриев",
    bornAt: "1998-11-30T00:00:00.000Z",
    cityName: "Иваново",
    specializationName: "Fullstack-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 200000,
    salaryTo: 260000,
    skillNames: [
      "Next.js",
      "React.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Docker",
    ],
    description:
      "Middle fullstack-разработчик, беру задачи end-to-end: от интерфейса и формы до API и деплоя.",
    workExperience: [
      {
        position: "Fullstack-разработчик",
        companyName: "ЦФТ",
        startedAt: "2022-08-01T00:00:00.000Z",
        description:
          "Разрабатываю внутренние кабинеты и backend-сервисы, участвую в декомпозиции фич и стабилизации релизов.",
      },
    ],
    projects: [
      {
        title: "Service Desk Portal",
        description:
          "Внутренний fullstack-портал с заявками, ролями, поиском и аналитикой по обращениям.",
        skillNames: ["Next.js", "NestJS", "PostgreSQL", "TypeScript"],
      },
    ],
    avatarLabel: "МД",
  },
  {
    key: "candidate-no-exp",
    email: "egor.kuzmin@example.com",
    firstName: "Егор",
    lastName: "Кузьмин",
    bornAt: "2003-03-16T00:00:00.000Z",
    cityName: "Иваново",
    specializationName: "Backend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 70000,
    salaryTo: 100000,
    skillNames: ["Node.js", "JavaScript", "Git"],
    description:
      "Начинающий backend-разработчик. Пока без коммерческого опыта, активно учусь и решаю учебные задачи.",
    workExperience: [],
    projects: [],
  },
  {
    key: "candidate-hidden",
    email: "hidden.candidate@example.com",
    firstName: "Татьяна",
    lastName: "Романова",
    bornAt: "1994-08-08T00:00:00.000Z",
    cityName: "Москва",
    specializationName: "Аналитик данных",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 170000,
    salaryTo: 230000,
    skillNames: ["SQL", "Python", "Pandas", "Power BI"],
    description:
      "Аналитик данных, временно скрыла профиль из поиска, но продолжаю просматривать вакансии.",
    isHidden: true,
    workExperience: [
      {
        position: "Аналитик данных",
        companyName: "Самокат",
        startedAt: "2022-02-01T00:00:00.000Z",
        description:
          "Готовлю дашборды, продуктовые метрики и ad-hoc анализы для маркетинга и retention.",
      },
    ],
    projects: [],
  },
  {
    key: "candidate-manual-qa",
    email: "yulia.smirnova@example.com",
    firstName: "Юлия",
    lastName: "Смирнова",
    bornAt: "1997-09-01T00:00:00.000Z",
    cityName: "Самара",
    specializationName: "QA-инженер",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 120000,
    salaryTo: 160000,
    skillNames: ["QA", "Ручное тестирование", "Postman", "TestRail"],
    description: "QA Engineer с уклоном в ручное тестирование web и API.",
    workExperience: [
      {
        position: "QA-инженер",
        companyName: "EPAM",
        startedAt: "2023-01-01T00:00:00.000Z",
        description:
          "Занимаюсь регрессией, тест-дизайном и подготовкой релизов в web-проектах.",
      },
    ],
    projects: [],
    avatarLabel: "ЮС",
  },
  {
    key: "candidate-php-middle",
    email: "vadim.semenov@example.com",
    firstName: "Вадим",
    lastName: "Семёнов",
    bornAt: "1996-01-19T00:00:00.000Z",
    cityName: "Воронеж",
    specializationName: "Backend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 170000,
    salaryTo: 220000,
    skillNames: ["PHP", "Laravel", "MySQL", "Docker", "REST API"],
    description:
      "Middle PHP backend-разработчик, основной стек Laravel/MySQL, люблю понятные интеграции и чистый код.",
    workExperience: [
      {
        position: "Backend-разработчик",
        companyName: "DataArt",
        startedAt: "2021-06-01T00:00:00.000Z",
        description:
          "Разрабатываю внутренние сервисы и административные модули, работаю с очередями и интеграциями.",
      },
    ],
    projects: [
      {
        title: "CRM Integrator",
        description:
          "Сервис интеграции CRM и ERP на Laravel с очередями, логированием и API-документацией.",
        skillNames: ["Laravel", "MySQL", "REST API"],
      },
    ],
  },
  {
    key: "candidate-go-middle",
    email: "grigory.belov@example.com",
    firstName: "Григорий",
    lastName: "Белов",
    bornAt: "1995-07-24T00:00:00.000Z",
    cityName: "Казань",
    specializationName: "Backend-разработчик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Remote,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 220000,
    salaryTo: 280000,
    skillNames: ["Go", "PostgreSQL", "Docker", "gRPC", "REST API"],
    description:
      "Middle backend-разработчик на Go. Пишу сервисы, люблю производительность, понятные API и измеримость.",
    workExperience: [
      {
        position: "Go Developer",
        companyName: "Точка",
        startedAt: "2022-02-01T00:00:00.000Z",
        description:
          "Работаю над внутренними и клиентскими сервисами, занимаюсь производительностью, документацией и наблюдаемостью.",
      },
    ],
    projects: [],
    avatarLabel: "ГБ",
  },
  {
    key: "candidate-business-analyst",
    email: "oksana.filippova@example.com",
    firstName: "Оксана",
    lastName: "Филиппова",
    bornAt: "1993-10-29T00:00:00.000Z",
    cityName: "Екатеринбург",
    specializationName: "Бизнес-аналитик",
    employmentType: VacancyEmploymentType.FullTime,
    format: VacancyFormat.Hybrid,
    schedule: VacancySchedule.FiveTwo,
    salaryFrom: 180000,
    salaryTo: 230000,
    skillNames: ["Системный анализ", "BPMN", "UML", "Agile"],
    description:
      "Business/System analyst с опытом описания процессов и работы с внутренними заказчиками.",
    workExperience: [
      {
        position: "Бизнес-аналитик",
        companyName: "СКБ Контур",
        startedAt: "2020-09-01T00:00:00.000Z",
        description:
          "Собираю требования, описываю процессы и поддерживаю delivery-команды в проектировании решений.",
      },
    ],
    projects: [],
  },
]

export const APPLICATIONS: ApplicationSeed[] = [
  {
    key: "app-demo-invitation-progress",
    createdAt: "2026-05-05T09:00:00.000Z",
    type: ApplicationType.Invitation,
    status: ApplicationStatus.Pending,
    candidateKey: "candidate-demo",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-frontend-senior",
    currentStepName: "Технический скрининг",
    messages: [
      {
        createdAt: "2026-05-05T09:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterInvited,
        notification: {
          recipient: "candidate",
          readAt: "2026-05-01T10:00:00.000Z",
        },
      },
      {
        createdAt: "2026-05-05T09:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Мария, добрый день. Ваш опыт с Next.js и дизайн-системами выглядит очень релевантно для нашей команды. Будем рады обсудить роль.",
      },
      {
        createdAt: "2026-05-06T08:30:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateAccepted,
        notification: {
          recipient: "recruiter",
          readAt: "2026-05-02T08:30:00.000Z",
        },
      },
      {
        createdAt: "2026-05-06T08:31:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.MeetingScheduled,
        meeting: {
          stepName: "Скрининг с рекрутером",
          startsAt: "2026-05-15T11:00:00.000Z",
          endsAt: "2026-05-15T12:00:00.000Z",
          timezone: "Europe/Moscow",
          link: "https://meet.example.com/demo-frontend-screening",
        },
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-07T11:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-07T11:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за встречу. Предлагаем перейти на техническое интервью с frontend lead и инженером платформы.",
      },
    ],
    stageResults: [
      {
        createdAt: "2026-05-06T10:00:00.000Z",
        stepName: "Скрининг с рекрутером",
        summary:
          "Сильный продуктовый background, уверенная коммуникация, хороший уровень влияния на архитектуру frontend-слоя.",
        pros: "Глубокий опыт с Next.js, SSR и дизайн-системами; умеет объяснять решения через продуктовый контекст.",
        cons: "Нужно отдельно проверить практику с GraphQL и сложными backend-контрактами.",
        notes:
          "Кандидат мотивирован на команду с сильной инженерной культурой и заметным влиянием на продукт.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
    ],
  },
  {
    key: "app-demo-response-approved",
    createdAt: "2026-04-09T10:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Approved,
    candidateKey: "candidate-demo",
    recruiterKey: "recruiter-finverse",
    vacancyKey: "vac-ui-ux",
    currentStepName: "Финальное интервью",
    messages: [
      {
        createdAt: "2026-04-09T10:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
          readAt: "2026-04-10T08:00:00.000Z",
        },
      },
      {
        createdAt: "2026-04-09T10:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Откликаюсь, потому что много работала на стыке frontend и дизайн-систем, а также менторила дизайнеров и разработчиков в общей продуктовой среде.",
      },
      {
        createdAt: "2026-04-10T09:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
          readAt: "2026-04-11T09:00:00.000Z",
        },
      },
      {
        createdAt: "2026-04-10T09:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Предлагаем созвониться с hiring manager и обсудить ваш опыт в продуктовой среде.",
      },
      {
        createdAt: "2026-04-11T12:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateAccepted,
        notification: {
          recipient: "recruiter",
          readAt: "2026-04-11T12:00:00.000Z",
        },
      },
      {
        createdAt: "2026-04-11T12:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.MeetingScheduled,
        meeting: {
          stepName: "Интервью с рекрутером",
          startsAt: "2026-04-14T12:00:00.000Z",
          endsAt: "2026-04-14T13:00:00.000Z",
          timezone: "Europe/Moscow",
          link: "https://meet.example.com/ui-ux-screening",
        },
        notification: {
          recipient: "recruiter",
          readAt: "2026-04-11T12:05:00.000Z",
        },
      },
      {
        createdAt: "2026-04-16T09:30:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
          readAt: "2026-04-16T09:30:00.000Z",
        },
      },
      {
        createdAt: "2026-04-16T09:31:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за этап. Переходим к финальной встрече с product design lead.",
      },
      {
        createdAt: "2026-04-18T15:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedJob,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-04-18T15:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Команда готова сделать оффер. Если интересно, обсудим детали по роли и компенсации.",
      },
    ],
    stageResults: [
      {
        createdAt: "2026-04-10T12:00:00.000Z",
        stepName: "Интервью с рекрутером",
        summary:
          "Сильный опыт в продуктовых командах, зрелая коммуникация, понятно формулирует impact своих решений.",
        pros: "Хорошо понимает роль дизайна в продуктовой разработке, умеет работать с кросс-функциональной командой.",
        notes:
          "Потенциально сильный bridge между дизайном и frontend-командой.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
      {
        createdAt: "2026-04-16T11:00:00.000Z",
        stepName: "Техническое интервью",
        summary:
          "Уверенно обсуждает handoff, компонентные библиотеки и процесс валидации UX-решений.",
        pros: "Есть зрелое портфолио и хорошие практики дизайн-систем.",
        cons: "Нужна адаптация к e-commerce-специфике, но это некритично.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
    ],
  },
  {
    key: "app-demo-rejected-by-recruiter",
    createdAt: "2026-04-29T11:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Rejected,
    candidateKey: "candidate-demo",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-product-manager",
    currentStepName: "Интервью с рекрутером",
    messages: [
      {
        createdAt: "2026-04-29T11:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
          readAt: "2026-03-20T09:00:00.000Z",
        },
      },
      {
        createdAt: "2026-04-29T11:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Откликаюсь на роль product manager, потому что много взаимодействовала с продуктовой аналитикой и discovery-процессами в своих командах.",
      },
      {
        createdAt: "2026-04-30T13:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterRejected,
        notification: {
          recipient: "candidate",
          readAt: "2026-03-22T13:00:00.000Z",
        },
      },
      {
        createdAt: "2026-04-30T13:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за интерес к роли. Мы ищем профиль с более прямым продуктовым ownership-опытом в B2B SaaS.",
      },
    ],
  },
  {
    key: "app-backend-approved",
    createdAt: "2026-05-06T10:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Approved,
    candidateKey: "candidate-backend-senior",
    recruiterKey: "recruiter-finverse",
    vacancyKey: "vac-backend-java",
    currentStepName: "Командное интервью",
    messages: [
      {
        createdAt: "2026-05-06T10:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-06T10:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Интересна роль на стыке core backend и событийной архитектуры. Есть релевантный опыт в highload и сложных интеграциях.",
      },
      {
        createdAt: "2026-05-06T12:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-06T12:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content: "Предлагаем перейти на технический скрининг с team lead.",
      },
      {
        createdAt: "2026-05-07T09:30:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateAccepted,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-07T09:31:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.MeetingScheduled,
        meeting: {
          stepName: "Скрининг с рекрутером",
          startsAt: "2026-05-18T10:00:00.000Z",
          endsAt: "2026-05-18T11:00:00.000Z",
          timezone: "Europe/Moscow",
          link: "https://meet.example.com/backend-java-tech",
        },
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-08T14:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-08T14:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Технический этап пройден сильно. Переходим к финальной встрече с engineering manager.",
      },
      {
        createdAt: "2026-05-09T16:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedJob,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-09T16:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content: "Команда готова сделать оффер и обсудить детали выхода.",
      },
    ],
    stageResults: [
      {
        createdAt: "2026-05-06T13:00:00.000Z",
        stepName: "Скрининг с рекрутером",
        summary:
          "Сильный senior backend, хорошие примеры ownership и highload-кейсов.",
        pros: "Глубокий Java/Spring Boot, Kafka и архитектурная зрелость.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
      {
        createdAt: "2026-05-08T15:00:00.000Z",
        stepName: "Технический скрининг",
        summary:
          "Уверенно прошёл блок по транзакционности, конкуренции и профилированию.",
        pros: "Показывает зрелый технический уровень и системное мышление.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
    ],
  },
  {
    key: "app-devops-pending",
    createdAt: "2026-05-07T09:30:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Pending,
    candidateKey: "candidate-devops-middle",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-devops-middle",
    currentStepName: "Техническое интервью",
    messages: [
      {
        createdAt: "2026-05-07T09:30:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-07T09:31:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Интересна роль с упором на Kubernetes и observability. Последние годы занимаюсь именно такими задачами.",
      },
      {
        createdAt: "2026-05-07T12:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-07T12:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Предлагаем интервью с рекрутером и обсуждение формата работы.",
      },
      {
        createdAt: "2026-05-08T08:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateAccepted,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-08T08:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.MeetingScheduled,
        meeting: {
          stepName: "Интервью с рекрутером",
          startsAt: "2026-05-16T09:00:00.000Z",
          endsAt: "2026-05-16T10:00:00.000Z",
          timezone: "Europe/Moscow",
          link: "https://meet.example.com/devops-screening",
        },
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-09T10:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-09T10:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Переходим к техническому интервью. Хотим подробно поговорить про инфраструктуру, CI/CD и инциденты.",
      },
    ],
    stageResults: [
      {
        createdAt: "2026-05-08T12:00:00.000Z",
        stepName: "Интервью с рекрутером",
        summary:
          "Хорошо понимает ожидания роли, адекватные ожидания по компенсации и формату.",
        pros: "Релевантный инфраструктурный опыт, зрелая коммуникация.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
    ],
  },
  {
    key: "app-qa-rejected-by-candidate",
    createdAt: "2026-04-30T09:00:00.000Z",
    type: ApplicationType.Invitation,
    status: ApplicationStatus.Rejected,
    candidateKey: "candidate-qa-auto",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-qa-auto",
    currentStepName: "Скрининг",
    messages: [
      {
        createdAt: "2026-04-30T09:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterInvited,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-04-30T09:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Ваш опыт очень релевантен нашей QA-команде. Будем рады обсудить вакансию.",
      },
      {
        createdAt: "2026-05-01T07:30:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateRejected,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-01T07:31:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за приглашение. Сейчас не рассматриваю переход, так как уже нахожусь на финальной стадии по другой роли.",
      },
    ],
  },
  {
    key: "app-junior-backend-pending",
    createdAt: "2026-05-08T15:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Pending,
    candidateKey: "candidate-backend-junior",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-backend-middle",
    currentStepName: "Скрининг с рекрутером",
    messages: [
      {
        createdAt: "2026-05-08T15:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-08T15:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Понимаю, что вакансия middle-уровня, но хочу попробовать себя и получить обратную связь. Есть релевантный pet-проект и стажировка.",
      },
    ],
  },
  {
    key: "app-archived-vacancy",
    createdAt: "2026-03-12T10:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Rejected,
    candidateKey: "candidate-manual-qa",
    recruiterKey: "recruiter-finverse",
    vacancyKey: "vac-uiux-archived",
    currentStepName: "Интервью с рекрутером",
    messages: [
      {
        createdAt: "2026-03-12T10:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-03-12T10:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Откликаюсь на вакансию, так как интересуюсь переходом в дизайн-смежную роль через UX research и quality review.",
      },
      {
        createdAt: "2026-03-14T11:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.VacancyArchived,
        notification: {
          recipient: "candidate",
        },
      },
    ],
  },
  {
    key: "app-go-response",
    createdAt: "2026-05-02T12:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Pending,
    candidateKey: "candidate-go-middle",
    recruiterKey: "recruiter-finverse",
    vacancyKey: "vac-go-backend",
    currentStepName: "Технический скрининг",
    messages: [
      {
        createdAt: "2026-05-02T12:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: {
          recipient: "recruiter",
        },
      },
      {
        createdAt: "2026-05-02T12:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Работаю на Go последние два года, хорошо знаком с API, производительностью и сервисной разработкой.",
      },
      {
        createdAt: "2026-05-03T09:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: {
          recipient: "candidate",
        },
      },
      {
        createdAt: "2026-05-03T09:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content: "Приглашаем на технический скрининг с backend lead.",
      },
    ],
  },
  {
    key: "app-fullstack-approved-demo-recruiter",
    createdAt: "2026-05-09T09:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Approved,
    candidateKey: "candidate-fullstack-middle",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-fullstack-middle",
    currentStepName: "Командное интервью",
    messages: [
      {
        createdAt: "2026-05-09T09:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: { recipient: "recruiter" },
      },
      {
        createdAt: "2026-05-09T09:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Роль выглядит очень близкой к моему текущему стеку. Интересны задачи end-to-end и работа на стыке frontend и backend.",
      },
      {
        createdAt: "2026-05-09T11:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedStep,
        notification: { recipient: "candidate" },
      },
      {
        createdAt: "2026-05-09T11:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Предлагаем технический скрининг с командой и обсуждение ваших последних проектов.",
      },
      {
        createdAt: "2026-05-09T12:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateAccepted,
        notification: { recipient: "recruiter" },
      },
      {
        createdAt: "2026-05-09T12:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.MeetingScheduled,
        meeting: {
          stepName: "Технический скрининг",
          startsAt: "2026-05-13T10:00:00.000Z",
          endsAt: "2026-05-13T11:00:00.000Z",
          timezone: "Europe/Moscow",
          link: "https://meet.example.com/fullstack-tech-demo",
        },
        notification: { recipient: "recruiter" },
      },
      {
        createdAt: "2026-05-10T15:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterOfferedJob,
        notification: { recipient: "candidate" },
      },
      {
        createdAt: "2026-05-10T15:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Команда хочет сделать оффер. Вы хорошо попали по стеку, скорости коммуникации и уровню самостоятельности.",
      },
    ],
    stageResults: [
      {
        createdAt: "2026-05-09T17:00:00.000Z",
        stepName: "Технический скрининг",
        summary:
          "Кандидат уверенно показал fullstack-уровень, хорошо ориентируется в React/NestJS и умеет доводить задачи до результата.",
        pros: "Сильный практический опыт в близком стеке и хороший продуктовый контекст.",
        notes:
          "Хороший кандидат на быстрый выход в активную продуктовую команду.",
        recommendation: ApplicationStageRecommendation.Recommend,
      },
    ],
  },
  {
    key: "app-no-exp-rejected-demo-recruiter",
    createdAt: "2026-04-28T10:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Rejected,
    candidateKey: "candidate-no-exp",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-sre-senior",
    currentStepName: "Интервью с рекрутером",
    messages: [
      {
        createdAt: "2026-04-28T10:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: { recipient: "recruiter" },
      },
      {
        createdAt: "2026-04-28T10:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Понимаю, что вакансия senior-уровня, но хочу попробовать себя и получить обратную связь. Пока учусь и ищу первую работу.",
      },
      {
        createdAt: "2026-04-28T14:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterRejected,
        notification: { recipient: "candidate" },
      },
      {
        createdAt: "2026-04-28T14:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за отклик. Для этой вакансии нужен опыт production-инфраструктуры, дежурств и зрелой работы с reliability-практиками.",
      },
    ],
  },
  {
    key: "app-business-analyst-rejected-by-candidate-demo",
    createdAt: "2026-04-15T11:00:00.000Z",
    type: ApplicationType.Invitation,
    status: ApplicationStatus.Rejected,
    candidateKey: "candidate-business-analyst",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-backend-middle",
    currentStepName: "Скрининг с рекрутером",
    messages: [
      {
        createdAt: "2026-04-15T11:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterInvited,
        notification: {
          recipient: "candidate",
          readAt: "2026-04-15T12:00:00.000Z",
        },
      },
      {
        createdAt: "2026-04-15T11:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "У вас сильный аналитический профиль. Хотели проверить, не рассматриваете ли вы переход в более техническую backend-роль.",
      },
      {
        createdAt: "2026-04-16T08:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateRejected,
        notification: {
          recipient: "recruiter",
          readAt: "2026-04-16T08:30:00.000Z",
        },
      },
      {
        createdAt: "2026-04-16T08:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за приглашение. Сейчас не рассматриваю backend-позиции, потому что мой фокус остаётся на аналитике и работе с требованиями.",
      },
    ],
  },
  {
    key: "app-designer-rejected-demo-recruiter",
    createdAt: "2026-05-04T13:00:00.000Z",
    type: ApplicationType.Response,
    status: ApplicationStatus.Rejected,
    candidateKey: "candidate-designer-middle",
    recruiterKey: "recruiter-demo",
    vacancyKey: "vac-product-manager",
    currentStepName: "Интервью с рекрутером",
    messages: [
      {
        createdAt: "2026-05-04T13:00:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.CandidateResponded,
        notification: { recipient: "recruiter" },
      },
      {
        createdAt: "2026-05-04T13:01:00.000Z",
        senderRole: UserRole.Candidate,
        type: ApplicationMessageType.UserMessage,
        content:
          "Интересуюсь продуктовой ролью, так как много работаю с исследованиями и пользовательскими сценариями. Хочу понять, могу ли перейти в продакт-менеджмент.",
      },
      {
        createdAt: "2026-05-05T10:00:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.RecruiterRejected,
        notification: { recipient: "candidate" },
      },
      {
        createdAt: "2026-05-05T10:01:00.000Z",
        senderRole: UserRole.Recruiter,
        type: ApplicationMessageType.UserMessage,
        content:
          "Спасибо за отклик. Для этой роли нужен более прямой опыт ownership продуктовых метрик, roadmap и приоритизации delivery.",
      },
    ],
  },
]
