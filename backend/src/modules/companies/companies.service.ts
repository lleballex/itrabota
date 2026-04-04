import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, EntityManager, Repository } from "typeorm"

import { Company } from "./entities/company.entity"

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
  ) {}

  findOneById(id: string, manager?: EntityManager) {
    const repo = manager?.getRepository(Company) ?? this.companiesRepo

    return repo.findOneBy({ id })
  }

  async create(data: DeepPartial<Company>, manager?: EntityManager) {
    const repo = manager?.getRepository(Company) ?? this.companiesRepo

    const company = repo.create(data)
    const savedCompany = await repo.save(company)

    return this.findOneById(savedCompany.id, manager)
  }

  async update(
    id: string,
    data: DeepPartial<Company>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Company) ?? this.companiesRepo
    const company = repo.create({ id, ...data })

    await repo.save(company)

    return this.findOneById(id, manager)
  }
}
