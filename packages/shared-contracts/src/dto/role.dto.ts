import { E_ROLE_NAME } from "../enums/role-name.enum";

// Pure DTO interfaces - no domain entity imports

export interface PermissionResponseDTO {
  action: string;
  resource: string;
  field: string;
}

export interface RoleResponseDTO {
  id: string;
  name: E_ROLE_NAME;
  description: string;
  permissions: string[];
}

export interface CreateRoleRequestDTO {
  name: E_ROLE_NAME;
  description: string;
  permissions: string[];
}

export interface UpdateRolePermissionsRequestDTO {
  roleId: string;
  permissions: string[];
}
