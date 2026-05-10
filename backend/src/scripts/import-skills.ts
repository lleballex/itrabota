import { NestFactory } from "@nestjs/core"

import { AppModule } from "@/app.module"
import { SkillsService } from "@/modules/skills/skills.service"
import { SKILL_SEED_DATA } from "@/modules/skills/data/skills.seed"

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  })

  try {
    const skillsService = app.get(SkillsService)
    const skills = await skillsService.syncDefinitions(SKILL_SEED_DATA)

    console.log(`Imported ${skills.length} skills`)
  } finally {
    await app.close()
  }
}

void bootstrap()
