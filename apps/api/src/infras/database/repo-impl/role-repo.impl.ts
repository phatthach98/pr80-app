import { RoleRepository } from "@application/interface/repository/role-repo.interface";
import { Role, ROLE_NAME } from "@domain/entity/role";
import { Permission } from "@domain/entity/permission";
import { RoleModel } from "@infras/database/schemas";

export class RoleRepoImpl implements RoleRepository {
  async create(roleData: Role): Promise<Role> {
    const roleToSave = {
      _id: roleData.id,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.getPermissions(),
    };

    const resp = await RoleModel.create(roleToSave);

    return roleData;
  }

  async findById(id: string): Promise<Role | null> {
    const roleDoc = await RoleModel.findById(id).lean();

    if (!roleDoc) {
      return null;
    }

    const role = new Role(
      roleDoc._id.toString(),
      roleDoc.name as ROLE_NAME,
      roleDoc.description
    );

    if (roleDoc.permissions) {
      roleDoc.permissions.forEach((p) => {
        try {
          role.addPermission(Permission.fromString(p));
        } catch (error) {
          // Log or handle the malformed permission string
          console.error(`Skipping malformed permission: ${p}`, error);
        }
      });
    }

    return role;
  }

  async findByName(name: ROLE_NAME): Promise<Role | null> {
    const roleDoc = await RoleModel.findOne({
      name,
    }).lean();

    if (!roleDoc) {
      return null;
    }

    const role = new Role(
      roleDoc._id.toString(),
      roleDoc.name as ROLE_NAME,
      roleDoc.description
    );

    if (roleDoc.permissions) {
      roleDoc.permissions.forEach((p) => {
        try {
          role.addPermission(Permission.fromString(p));
        } catch (error) {
          // Log or handle the malformed permission string
          console.error(`Skipping malformed permission: ${p}`, error);
        }
      });
    }

    return role;
  }

  async findRoles(): Promise<Role[]> {
    const roleDocs = await RoleModel.find().lean();

    return roleDocs.map((roleDoc) => {
      const role = new Role(
        roleDoc._id.toString(),
        roleDoc.name as ROLE_NAME,
        roleDoc.description
      );

      if (roleDoc.permissions) {
        roleDoc.permissions.forEach((p) => {
          try {
            role.addPermission(Permission.fromString(p));
          } catch (error) {
            // Log or handle the malformed permission string
            console.error(`Skipping malformed permission: ${p}`, error);
          }
        });
      }
      return role;
    });
  }

  async updatePermissions(
    roleId: string,
    permissions: string[]
  ): Promise<string> {
    await RoleModel.findByIdAndUpdate(roleId, {
      permissions: permissions,
    });

    return roleId;
  }
}
