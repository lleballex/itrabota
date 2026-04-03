import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm"

import { FunnelStep } from "./entities/funnel-step.entity"

@Injectable()
export class FunnelStepsService {
  constructor(
    @InjectRepository(FunnelStep)
    private readonly funnelStepsRepo: Repository<FunnelStep>,
  ) {}

  private async findOne(
    where: FindOptionsWhere<FunnelStep>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(FunnelStep) ?? this.funnelStepsRepo
    const funnelStep = await repo.findOne({ where })

    if (!funnelStep) {
      throw new NotFoundException("Funnel step not found")
    }

    return funnelStep
  }

  findOneById(id: string, manager?: EntityManager) {
    return this.findOne({ id }, manager)
  }

  async create(data: DeepPartial<FunnelStep>, manager?: EntityManager) {
    const repo = manager?.getRepository(FunnelStep) ?? this.funnelStepsRepo

    const funnelStep = repo.create(data)
    const savedFunnelStep = await repo.save(funnelStep)

    return this.findOneById(savedFunnelStep.id, manager)
  }

  async update(
    id: string,
    data: DeepPartial<FunnelStep>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(FunnelStep) ?? this.funnelStepsRepo
    const funnelStep = repo.create({ ...data, id })

    await repo.save(funnelStep)

    return this.findOneById(id)
  }

  async delete(id: string, manager?: EntityManager) {
    const repo = manager?.getRepository(FunnelStep) ?? this.funnelStepsRepo
    const funnelStep = await this.findOneById(id, manager)

    await repo.remove(funnelStep)
  }
}
