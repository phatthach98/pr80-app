import { User } from "@domain/entity/user";
import { UserRepository } from "@application/interface/repository/user-repo.interface";
import { BadRequestError, NotFoundError } from "@application/errors";
import { RoleRepository } from "@application/interface/repository";
import { ROLE_NAME } from "@domain/entity/role";

export class UserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async createUser(
    user: Pick<User, "name" | "phoneNumber">,
    passCode: string,
    roleIds: string[]
  ): Promise<User> {
    return this.userRepository.create(user, passCode, roleIds);
  }

  async assignRoleToUser(
    userId: string,
    roleName: ROLE_NAME
  ): Promise<{ roleId: string }> {
    const currentUser = await this.userRepository.findUserById(userId);
    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    const role = await this.roleRepository.findByName(roleName);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    const isExistedRole = currentUser.roles.some((role) => role.id === role.id);
    if (isExistedRole) {
      throw new BadRequestError("Role already assigned to user");
    }

    return this.userRepository.addRole(currentUser.id, role.id);
  }

  async getUsers(page: number = 1, limit: number = 20): Promise<User[]> {
    return this.userRepository.findUsers(page, limit);
  }
}
