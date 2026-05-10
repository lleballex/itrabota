import { NestFactory } from "@nestjs/core"
import { webcrypto } from "node:crypto"
import { readFile } from "node:fs/promises"
import { extname, resolve } from "node:path"
import { DataSource, EntityManager } from "typeorm"

import { SkillsService } from "@/modules/skills/skills.service"
import { SKILL_SEED_DATA } from "@/modules/skills/data/skills.seed"
import { City } from "@/modules/cities/entities/city.entity"
import { Industry } from "@/modules/industries/entities/industry.entity"
import { Specialization } from "@/modules/specializations/entities/specialization.entity"
import { Skill } from "@/modules/skills/entities/skills.entity"
import { User } from "@/modules/users/entities/user.entity"
import { Candidate } from "@/modules/users/entities/candidate.entity"
import { Recruiter } from "@/modules/users/entities/recruiter.entity"
import { Company } from "@/modules/companies/entities/company.entity"
import { Vacancy } from "@/modules/vacancies/entities/vacancy.entity"
import { FunnelStep } from "@/modules/vacancies/entities/funnel-step.entity"
import { Attachment } from "@/modules/attachments/entities/attachment.entity"
import { WorkExperienceItem } from "@/modules/users/entities/work-experence-item.entity"
import { CandidateProjectItem } from "@/modules/users/entities/candidate-project-item.entity"
import { Application } from "@/modules/applications/entities/application.entity"
import { ApplicationMessage } from "@/modules/applications/entities/application-message.entity"
import { ApplicationStageResult } from "@/modules/applications/entities/application-stage-result.entity"
import { Meeting } from "@/modules/meetings/entities/meeting.entity"
import { Notification } from "@/modules/notifications/entities/notification.entity"
import { UserRole } from "@/modules/users/types/user-role"
import {
  APPLICATIONS,
  CANDIDATES,
  DEMO_CITIES,
  DEMO_INDUSTRIES,
  DEMO_PASSWORD_HASH,
  DEMO_SPECIALIZATIONS,
  RECRUITERS,
  type CandidateProjectSeed,
  type WorkExperienceSeed,
} from "@/scripts/demo-seed.data"

type ReferenceMaps = {
  cities: Map<string, City>
  industries: Map<string, Industry>
  specializations: Map<string, Specialization>
  skills: Map<string, { id: string; name: string }>
  users: Map<string, User>
  candidates: Map<string, Candidate>
  recruiters: Map<string, Recruiter>
  companies: Map<string, Company>
  vacancies: Map<string, Vacancy>
  funnelSteps: Map<string, FunnelStep>
}

const DEMO_SEED_ASSETS_DIR = resolve(
  process.cwd(),
  "src/scripts/demo-seed-assets",
)

const RECRUITER_LOGO_ASSET_BY_EMAIL = new Map<string, string>([
  ["recruiter@example.com", "recruiter1.png"],
  ["elena.karpova@example.com", "recruiter2.png"],
])

const CANDIDATE_AVATAR_ASSET_BY_EMAIL = new Map<string, string>([
  ["candidate@example.com", "candidate2woman.jpg"],
  ["ivan.petrov@example.com", "candidate1man.jpg"],
  ["denis.orlov@example.com", "candidate3man.jpg"],
  ["olga.kuznetsova@example.com", "candidate5woman.jpg"],
  ["anna.volkova@example.com", "candidate6woman.jpg"],
  ["sergey.morozov@example.com", "candidate4man.jpg"],
  ["kirill.smolin@example.com", "candidate7man.jpg"],
  ["pavel.egorov@example.com", "candidate8man.jpg"],
])

function getMimeType(fileName: string) {
  switch (extname(fileName).toLowerCase()) {
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    default:
      throw new Error(`Unsupported asset extension for "${fileName}"`)
  }
}

function createAttachment(
  manager: EntityManager,
  name: string,
  mimeType: string,
  content: Buffer,
) {
  return manager.getRepository(Attachment).save(
    manager.getRepository(Attachment).create({
      name,
      mimeType,
      size: content.length,
      content,
    }),
  )
}

async function createAttachmentFromAsset(
  manager: EntityManager,
  fileName: string,
) {
  const content = await readFile(resolve(DEMO_SEED_ASSETS_DIR, fileName))

  return createAttachment(manager, fileName, getMimeType(fileName), content)
}

function requireMapItem<T>(
  map: Map<string, T>,
  key: string,
  entityName: string,
) {
  const value = map.get(key)

  if (!value) {
    throw new Error(`${entityName} "${key}" not found in seed references`)
  }

  return value
}

async function setTimestamps<T extends { id: string }>(
  manager: EntityManager,
  entityClass: new () => T,
  id: string,
  createdAt: string,
  updatedAt?: string,
) {
  await manager
    .getRepository(entityClass)
    .createQueryBuilder()
    .update()
    .set({
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt ?? createdAt),
    } as never)
    .where("id = :id", { id })
    .execute()
}

async function seedLookups(
  manager: EntityManager,
  skillsService: SkillsService,
): Promise<ReferenceMaps> {
  const cityRepo = manager.getRepository(City)
  const industryRepo = manager.getRepository(Industry)
  const specializationRepo = manager.getRepository(Specialization)

  await cityRepo.save(DEMO_CITIES.map((name) => cityRepo.create({ name })))
  await industryRepo.save(
    DEMO_INDUSTRIES.map((name) => industryRepo.create({ name })),
  )
  await specializationRepo.save(
    DEMO_SPECIALIZATIONS.map((name) => specializationRepo.create({ name })),
  )

  await skillsService.syncDefinitions(SKILL_SEED_DATA, manager)

  const [cities, industries, specializations, skills] = await Promise.all([
    cityRepo.find(),
    industryRepo.find(),
    specializationRepo.find(),
    skillsService.findAll(manager),
  ])

  return {
    cities: new Map(cities.map((item) => [item.name, item])),
    industries: new Map(industries.map((item) => [item.name, item])),
    specializations: new Map(specializations.map((item) => [item.name, item])),
    skills: new Map(skills.map((item) => [item.name, item])),
    users: new Map(),
    candidates: new Map(),
    recruiters: new Map(),
    companies: new Map(),
    vacancies: new Map(),
    funnelSteps: new Map(),
  }
}

function mapSkillNamesToRefs(
  references: ReferenceMaps,
  skillNames: string[] | undefined,
) {
  return (skillNames ?? []).map((skillName) => ({
    id: requireMapItem(references.skills, skillName, "Skill").id,
  }))
}

async function createWorkExperienceItems(
  manager: EntityManager,
  candidate: Candidate,
  items: WorkExperienceSeed[] | undefined,
) {
  if (!items?.length) {
    return []
  }

  const repo = manager.getRepository(WorkExperienceItem)

  return repo.save(
    items.map((item) =>
      repo.create({
        ...item,
        endedAt: item.endedAt ?? null,
        description: item.description ?? null,
        candidate: { id: candidate.id },
      }),
    ),
  )
}

async function createProjectItems(
  manager: EntityManager,
  references: ReferenceMaps,
  candidate: Candidate,
  items: CandidateProjectSeed[] | undefined,
) {
  if (!items?.length) {
    return []
  }

  const repo = manager.getRepository(CandidateProjectItem)

  return repo.save(
    items.map((item) =>
      repo.create({
        title: item.title,
        url: item.url ?? null,
        description: item.description ?? null,
        skills: mapSkillNamesToRefs(references, item.skillNames),
        candidate: { id: candidate.id },
      }),
    ),
  )
}

async function seedCandidates(
  manager: EntityManager,
  references: ReferenceMaps,
) {
  const userRepo = manager.getRepository(User)
  const candidateRepo = manager.getRepository(Candidate)

  for (const seed of CANDIDATES) {
    const user = await userRepo.save(
      userRepo.create({
        email: seed.email,
        password: DEMO_PASSWORD_HASH,
        passwordChangedAt: null,
        role: UserRole.Candidate,
      }),
    )

    const avatarAssetFileName = CANDIDATE_AVATAR_ASSET_BY_EMAIL.get(seed.email)
    const avatar = avatarAssetFileName
      ? await createAttachmentFromAsset(manager, avatarAssetFileName)
      : null

    const candidate = await candidateRepo.save(
      candidateRepo.create({
        firstName: seed.firstName,
        lastName: seed.lastName,
        patronymic: seed.patronymic ?? null,
        bornAt: seed.bornAt,
        phoneNumber: seed.phoneNumber ?? null,
        tgUsername: seed.tgUsername ?? null,
        description: seed.description ?? null,
        education: seed.education ?? null,
        githubUrl: seed.githubUrl ?? null,
        gitlabUrl: seed.gitlabUrl ?? null,
        isHidden: seed.isHidden ?? false,
        city: seed.cityName
          ? { id: requireMapItem(references.cities, seed.cityName, "City").id }
          : null,
        specialization: seed.specializationName
          ? {
              id: requireMapItem(
                references.specializations,
                seed.specializationName,
                "Specialization",
              ).id,
            }
          : null,
        employmentType: seed.employmentType ?? null,
        format: seed.format ?? null,
        schedule: seed.schedule ?? null,
        salaryFrom: seed.salaryFrom ?? null,
        salaryTo: seed.salaryTo ?? null,
        skills: mapSkillNamesToRefs(references, seed.skillNames),
        avatar: avatar ? { id: avatar.id } : null,
        user: { id: user.id },
      }),
    )

    await createWorkExperienceItems(manager, candidate, seed.workExperience)
    await createProjectItems(manager, references, candidate, seed.projects)

    references.users.set(seed.key, user)
    references.candidates.set(
      seed.key,
      await candidateRepo.findOneOrFail({ where: { id: candidate.id } }),
    )
  }
}

async function seedRecruiters(
  manager: EntityManager,
  references: ReferenceMaps,
) {
  const userRepo = manager.getRepository(User)
  const recruiterRepo = manager.getRepository(Recruiter)
  const companyRepo = manager.getRepository(Company)
  const vacancyRepo = manager.getRepository(Vacancy)
  const funnelStepRepo = manager.getRepository(FunnelStep)

  for (const recruiterSeed of RECRUITERS) {
    const user = await userRepo.save(
      userRepo.create({
        email: recruiterSeed.email,
        password: DEMO_PASSWORD_HASH,
        passwordChangedAt: null,
        role: UserRole.Recruiter,
      }),
    )

    const recruiter = await recruiterRepo.save(
      recruiterRepo.create({
        firstName: recruiterSeed.firstName,
        lastName: recruiterSeed.lastName,
        patronymic: recruiterSeed.patronymic ?? null,
        user: { id: user.id },
      }),
    )

    const logoAssetFileName = RECRUITER_LOGO_ASSET_BY_EMAIL.get(
      recruiterSeed.email,
    )
    const logo = logoAssetFileName
      ? await createAttachmentFromAsset(manager, logoAssetFileName)
      : null

    const company = await companyRepo.save(
      companyRepo.create({
        name: recruiterSeed.companyName,
        url: recruiterSeed.companyUrl ?? null,
        recruiter: { id: recruiter.id },
        industry: {
          id: requireMapItem(
            references.industries,
            recruiterSeed.industryName,
            "Industry",
          ).id,
        },
        logo: logo ? { id: logo.id } : null,
      }),
    )

    references.users.set(recruiterSeed.key, user)
    references.recruiters.set(recruiterSeed.key, recruiter)
    references.companies.set(recruiterSeed.key, company)

    for (const vacancySeed of recruiterSeed.vacancies) {
      const vacancy = await vacancyRepo.save(
        vacancyRepo.create({
          title: vacancySeed.title,
          description: vacancySeed.description ?? null,
          requirements: vacancySeed.requirements ?? null,
          niceToHave: vacancySeed.niceToHave ?? null,
          responsibilities: vacancySeed.responsibilities ?? null,
          conditions: vacancySeed.conditions ?? null,
          status: vacancySeed.status,
          salaryFrom: vacancySeed.salaryFrom ?? null,
          salaryTo: vacancySeed.salaryTo ?? null,
          employmentType: vacancySeed.employmentType,
          format: vacancySeed.format,
          schedule: vacancySeed.schedule,
          workExperience: vacancySeed.workExperience,
          specialization: {
            id: requireMapItem(
              references.specializations,
              vacancySeed.specializationName,
              "Specialization",
            ).id,
          },
          city: vacancySeed.cityName
            ? {
                id: requireMapItem(
                  references.cities,
                  vacancySeed.cityName,
                  "City",
                ).id,
              }
            : null,
          recruiter: { id: recruiter.id },
          skills: mapSkillNamesToRefs(references, vacancySeed.skillNames),
        }),
      )

      references.vacancies.set(vacancySeed.key, vacancy)

      const funnelSteps = await funnelStepRepo.save(
        vacancySeed.funnelSteps.map((step, index) =>
          funnelStepRepo.create({
            index,
            name: step.name,
            approveMessage: step.approveMessage ?? null,
            rejectMessage: step.rejectMessage ?? null,
            shouldCreateCall: step.shouldCreateCall,
            vacancy: { id: vacancy.id },
          }),
        ),
      )

      for (const step of funnelSteps) {
        references.funnelSteps.set(`${vacancySeed.key}:${step.name}`, step)
      }
    }
  }
}

async function seedApplications(
  manager: EntityManager,
  references: ReferenceMaps,
) {
  const applicationRepo = manager.getRepository(Application)
  const messageRepo = manager.getRepository(ApplicationMessage)
  const stageResultRepo = manager.getRepository(ApplicationStageResult)
  const meetingRepo = manager.getRepository(Meeting)
  const notificationRepo = manager.getRepository(Notification)

  for (const applicationSeed of APPLICATIONS) {
    const candidate = requireMapItem(
      references.candidates,
      applicationSeed.candidateKey,
      "Candidate",
    )
    const recruiter = requireMapItem(
      references.recruiters,
      applicationSeed.recruiterKey,
      "Recruiter",
    )
    const vacancy = requireMapItem(
      references.vacancies,
      applicationSeed.vacancyKey,
      "Vacancy",
    )
    const currentStep = applicationSeed.currentStepName
      ? requireMapItem(
          references.funnelSteps,
          `${applicationSeed.vacancyKey}:${applicationSeed.currentStepName}`,
          "FunnelStep",
        )
      : null

    const application = await applicationRepo.save(
      applicationRepo.create({
        type: applicationSeed.type,
        status: applicationSeed.status,
        candidate: { id: candidate.id },
        vacancy: { id: vacancy.id },
        funnelStep: currentStep ? { id: currentStep.id } : null,
      }),
    )

    await setTimestamps(
      manager,
      Application,
      application.id,
      applicationSeed.createdAt,
    )

    for (const event of applicationSeed.messages) {
      const message = await messageRepo.save(
        messageRepo.create({
          senderRole: event.senderRole,
          type: event.type,
          content: event.content ?? null,
          application: { id: application.id },
        }),
      )

      await setTimestamps(
        manager,
        ApplicationMessage,
        message.id,
        event.createdAt ?? applicationSeed.createdAt,
      )

      let meeting: Meeting | null = null

      if (event.meeting) {
        const meetingStep = requireMapItem(
          references.funnelSteps,
          `${applicationSeed.vacancyKey}:${event.meeting.stepName}`,
          "FunnelStep",
        )

        meeting = await meetingRepo.save(
          meetingRepo.create({
            application: { id: application.id },
            candidate: { id: candidate.id },
            recruiter: { id: recruiter.id },
            funnelStep: { id: meetingStep.id },
            applicationMessage: { id: message.id },
            startsAt: event.meeting.startsAt,
            endsAt: event.meeting.endsAt,
            timezone: event.meeting.timezone,
            link: event.meeting.link,
          }),
        )

        await setTimestamps(
          manager,
          Meeting,
          meeting.id,
          event.createdAt ?? applicationSeed.createdAt,
        )
      }

      if (event.notification) {
        const recipientUser =
          event.notification.recipient === "candidate"
            ? requireMapItem(
                references.users,
                applicationSeed.candidateKey,
                "Candidate user",
              )
            : requireMapItem(
                references.users,
                applicationSeed.recruiterKey,
                "Recruiter user",
              )

        const notification = await notificationRepo.save(
          notificationRepo.create({
            recipientUser: { id: recipientUser.id },
            type: message.type,
            readAt:
              event.notification.readAt === undefined
                ? null
                : event.notification.readAt,
            application: { id: application.id },
            applicationMessage: { id: message.id },
            meeting: meeting ? { id: meeting.id } : null,
          }),
        )

        await setTimestamps(
          manager,
          Notification,
          notification.id,
          event.createdAt ?? applicationSeed.createdAt,
          event.notification.readAt ??
            event.createdAt ??
            applicationSeed.createdAt,
        )
      }
    }

    for (const stageResultSeed of applicationSeed.stageResults ?? []) {
      const step = requireMapItem(
        references.funnelSteps,
        `${applicationSeed.vacancyKey}:${stageResultSeed.stepName}`,
        "FunnelStep",
      )

      const stageResult = await stageResultRepo.save(
        stageResultRepo.create({
          application: { id: application.id },
          funnelStep: { id: step.id },
          authorRecruiter: { id: recruiter.id },
          summary: stageResultSeed.summary ?? null,
          pros: stageResultSeed.pros ?? null,
          cons: stageResultSeed.cons ?? null,
          notes: stageResultSeed.notes ?? null,
          recommendation: stageResultSeed.recommendation ?? null,
        }),
      )

      await setTimestamps(
        manager,
        ApplicationStageResult,
        stageResult.id,
        stageResultSeed.createdAt ?? applicationSeed.createdAt,
      )
    }
  }
}

async function printSummary(dataSource: DataSource) {
  const [
    cities,
    industries,
    specializations,
    skills,
    candidates,
    recruiters,
    companies,
    vacancies,
    applications,
    meetings,
    notifications,
  ] = await Promise.all([
    dataSource.getRepository(City).count(),
    dataSource.getRepository(Industry).count(),
    dataSource.getRepository(Specialization).count(),
    dataSource.getRepository(Skill).count(),
    dataSource.getRepository(Candidate).count(),
    dataSource.getRepository(Recruiter).count(),
    dataSource.getRepository(Company).count(),
    dataSource.getRepository(Vacancy).count(),
    dataSource.getRepository(Application).count(),
    dataSource.getRepository(Meeting).count(),
    dataSource.getRepository(Notification).count(),
  ])

  console.log(
    [
      `Cities: ${cities}`,
      `Industries: ${industries}`,
      `Specializations: ${specializations}`,
      `Skills: ${skills}`,
      `Candidates: ${candidates}`,
      `Recruiters: ${recruiters}`,
      `Companies: ${companies}`,
      `Vacancies: ${vacancies}`,
      `Applications: ${applications}`,
      `Meetings: ${meetings}`,
      `Notifications: ${notifications}`,
    ].join("\n"),
  )
}

async function bootstrap() {
  globalThis.crypto ??= webcrypto as unknown as Crypto

  const { AppModule } = await import("@/app.module")

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  })

  try {
    const dataSource = app.get(DataSource)
    const skillsService = app.get(SkillsService)

    await dataSource.dropDatabase()
    await dataSource.synchronize()

    await dataSource.transaction(async (manager) => {
      const references = await seedLookups(manager, skillsService)

      await seedCandidates(manager, references)
      await seedRecruiters(manager, references)
      await seedApplications(manager, references)
    })

    await printSummary(dataSource)
  } finally {
    await app.close()
  }
}

void bootstrap()
