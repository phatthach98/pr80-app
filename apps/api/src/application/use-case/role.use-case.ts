import { BadRequestError, NotFoundError } from "@application/errors";
import { RoleRepository } from "@application/interface/repository";
import { Permission } from "@domain/entity/permission";
import { Role } from "@domain/entity/role";
import { ROLE_NAME } from "@pr80-app/shared-contracts";

export class RoleUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  public async createRole(
    name: ROLE_NAME,
    description: string,
    permissions: Permission[]
  ): Promise<Role> {
    const existedRole = await this.roleRepository.findByName(name);
    if (existedRole) {
      throw new BadRequestError("Role already exists");
    }

    const newRole = Role.create(name, description);

    permissions.forEach((permission) => {
      newRole.addPermission(permission);
    });

    await this.roleRepository.create(newRole);

    return newRole;
  }

  public async updateRolePermissions(
    roleId: string,
    permissions: Permission[]
  ): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundError("Role not found");
    }
    const currentPermissions = role.getPermissions();
    const newPermissions = permissions.map((p) => p.toString());

    await this.roleRepository.updatePermissions(
      roleId,
      currentPermissions.concat(newPermissions)
    );

    return role;
  }

  public async getRoles(): Promise<Role[]> {
    return this.roleRepository.findRoles();
  }
}
