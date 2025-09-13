import { E_ROLE_NAME } from "../enums/role-name.enum";

// Pure DTO interfaces - no domain entity imports

export interface CreateUserRequestDTO {
  name: string;
  phoneNumber: string;
  passCode: string;
  roleIds: string[];
}

export interface AssignRoleRequestDTO {
  userId: string;
  roleName: E_ROLE_NAME;
}

export interface GetUsersRequestDTO {
  page: number;
  limit: number;
}

export interface GetUserDetailRequestDTO {
  userId: string;
}

export interface UserRoleResponseDTO {
  id: string;
  name: string;
}

export interface UserResponseDTO {
  id: string;
  phoneNumber: string;
  name: string;
  roles: UserRoleResponseDTO[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserRequestDTO {
  name?: string;
  phoneNumber?: string;
  roleIds?: string[];
}
