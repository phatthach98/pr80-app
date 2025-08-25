import { Role } from "@domain/entity/role";
import { ROLE_NAME } from "@pr80-app/shared-contracts";

export interface RoleRepository {
  create(roleData: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: ROLE_NAME): Promise<Role | null>;
  findRoles(): Promise<Role[]>;
  updatePermissions(roleId: string, permissions: string[]): Promise<string>;
}
