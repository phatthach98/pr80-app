import { Request, Response } from "express";
import { RoleUseCase } from "@application/use-case";
import { container } from "@infras/di";
import { ROLE_USE_CASE } from "@infras/di/tokens";
import { CreateRoleDto, UpdateRolePermissionsDto } from "./dto/role.dto";
import { Permission } from "@domain/entity/permission";

const roleUseCase = container.resolve<RoleUseCase>(ROLE_USE_CASE);

export class RoleController {
  static async createRole(req: Request<{}, {}, CreateRoleDto>, res: Response) {
    const { name, description, permissions } = req.body;

    const permissionEntities = permissions.map(Permission.fromString);

    const newRole = await roleUseCase.createRole(
      name,
      description,
      permissionEntities
    );
    res.status(201).json(newRole.toJSON());
  }

  static async updatePermissions(
    req: Request<{}, {}, UpdateRolePermissionsDto>,
    res: Response
  ) {
    const { roleId, permissions } = req.body;

    const permissionEntities = permissions.map(Permission.fromString);

    const updatedRole = await roleUseCase.updateRolePermissions(
      roleId,
      permissionEntities
    );

    res.status(200).json(updatedRole.toJSON());
  }

  static async getRoles(req: Request, res: Response) {
    const roles = await roleUseCase.getRoles();

    res.status(200).json(roles.map((role) => role.toJSON()));
  }
}
