import { v4 as uuid } from "uuid";

export enum ROLE_NAME {
  ADMIN = "admin",
  WAITER = "waiter",
  CHEF = "chef",
}

export class Role {
  public id: string;
  public name: ROLE_NAME;
  public description: string;
  private permissions: string[] = [];

  constructor(id: string, name: ROLE_NAME, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static create(name: ROLE_NAME, description: string) {
    return new Role(uuid(), name, description);
  }

  public addPermission(action: string, resource: string, field: string) {
    this.permissions.push(this.constructPermission(action, resource, field));
  }

  private constructPermission(action: string, resource: string, field: string) {
    return [action, resource, field].join("_");
  }

  public getPermissions() {
    return this.permissions;
  }

  public hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: this.permissions,
    };
  }
}
