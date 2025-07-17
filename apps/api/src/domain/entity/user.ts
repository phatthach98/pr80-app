import { v4 as uuid } from "uuid";
import { Role, ROLE_NAME } from "./role";

export class User {
  public id: string;
  public name: string;
  public phoneNumber: string;
  public roles: Role[] = [];

  constructor(id: string, name: string, phoneNumber: string) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
  }

  static create(name: string, phoneNumber: string) {
    return new User(uuid(), name, phoneNumber);
  }

  public addRole(role: Role) {
    if (!this.hasRole(role.name)) {
      this.roles.push(role);
    }
  }

  public removeRole(roleName: ROLE_NAME): void {
    this.roles = this.roles.filter((role) => role.name !== roleName);
  }

  private hasRole(roleName: ROLE_NAME): boolean {
    return this.roles.some((role) => role.name === roleName);
  }

  public isAdmin() {
    return this.hasRole(ROLE_NAME.ADMIN);
  }

  public isChef() {
    return this.hasRole(ROLE_NAME.CHEF);
  }

  public isWaiter() {
    return this.hasRole(ROLE_NAME.WAITER);
  }

  public hasPermission(permission: string) {
    return this.roles.some((role) => role.hasPermission(permission));
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      roles: this.roles.map((role) => role.toJSON()),
    };
  }
}
