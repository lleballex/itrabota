import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm"

import { FunnelStep } from "./entities/funnel-step.entity"

@Injectable()
export class FunnelStepsService {
  constructor(
    @InjectRepository(FunnelStep)
    private readonly funnelStepsRepo: Repository<FunnelStep>,
  ) {}

  private async findOne(where: FindOptionsWhere<FunnelStep>) {
    const funnelStep = await this.funnelStepsRepo.findOne({ where })

    if (!funnelStep) {
      throw new NotFoundException("Funnel step not found")
    }

    return funnelStep
  }

  findOneById(id: string) {
    return this.findOne({ id })
  }

  async create(data: DeepPartial<FunnelStep>) {
    const funnelStep = this.funnelStepsRepo.create(data)
    const savedFunnelStep = await this.funnelStepsRepo.save(funnelStep)

    return this.findOneById(savedFunnelStep.id)
  }

  async update(id: string, data: DeepPartial<FunnelStep>) {
    const funnelStep = this.funnelStepsRepo.create({ ...data, id })
    await this.funnelStepsRepo.save(funnelStep)

    return this.findOneById(id)
  }

  async delete(id: string) {
    const funnelStep = await this.findOneById(id)
    await this.funnelStepsRepo.remove(funnelStep)
  }
}
