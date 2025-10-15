import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, Repository } from "typeorm"

import { Company } from "./entities/company.entity"

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
  ) {}

  findOneById(id: string) {
    return this.companiesRepo.findOneBy({ id })
  }

  async create(data: DeepPartial<Company>) {
    const company = this.companiesRepo.create(data)
    const savedCompany = await this.companiesRepo.save(company)

    return this.findOneById(savedCompany.id)
  }
}
