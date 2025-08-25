import { v4 as uuid } from "uuid";
import { Role } from "./role";
import { Permission } from "./permission";
import { ROLE_NAME } from "@pr80-app/shared-contracts";

export class User {
  public id: string;
  public name: string;
  public phoneNumber: string;
  public roles: Role[] = [];
  private passCode: string;

  constructor(id: string, name: string, phoneNumber: string, passCode: string) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.passCode = passCode;
  }

  static create(name: string, phoneNumber: string, passCode: string) {
    return new User(uuid(), name, phoneNumber, passCode);
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
    return this.roles.some((role) => role.id === roleName);
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

  public hasPermission(permission: Permission) {
    return this.roles.some((role) => role.hasPermission(permission));
  }

  public isSamePassCode(passCode: string) {
    return this.passCode === passCode;
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
