import { Injectable } from "@nestjs/common"

import { UsersService } from "@/modules/users/users.service"

@Injectable()
export class MeService {
  constructor(private readonly usersService: UsersService) {}
}
