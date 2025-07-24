import { v4 as uuid } from "uuid";
import { Permission } from "./permission";

export enum ROLE_NAME {
  ADMIN = "admin",
  WAITER = "waiter",
  CHEF = "chef",
}

export const ROLE_NAME_VALUES = Object.values(ROLE_NAME);

export class Role {
  public id: string;
  public name: ROLE_NAME;
  public description: string;
  private permissions: Permission[] = [];

  constructor(id: string, name: ROLE_NAME, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static create(name: ROLE_NAME, description: string) {
    return new Role(uuid(), name, description);
  }

  public addPermission(permission: Permission) {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  public getPermissions(): string[] {
    return this.permissions.map((permission) => permission.toString());
  }

  public hasPermission(permission: Permission): boolean {
    return this.permissions.some((p) => p.equals(permission));
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: this.permissions.map((p) => p.toString()),
    };
  }
}
