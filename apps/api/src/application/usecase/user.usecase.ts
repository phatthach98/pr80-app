import { User } from "@domain/entity/user";
import { UserRepository } from "@application/interface/repository/user.repo";
import { Role } from "@/domain/entity/role";

export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: User, passCode: string, roleIds: string[]) {
    return this.userRepository.create(user.toJSON(), passCode, roleIds);
  }
}
