import { ROLE_NAME } from '../enums/role-name.enum';

// Pure DTO interfaces - no domain entity imports

export interface CreateUserRequestDTO {
  name: string;
  phoneNumber: string;
  passCode: string;
  roleIds: string[];
}

export interface AssignRoleRequestDTO {
  userId: string;
  roleName: ROLE_NAME;
}

export interface GetUsersRequestDTO {
  page: number;
  limit: number;
}
