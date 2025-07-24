import { User } from "@domain/entity/user";

export interface UserRepository {
  create(
    user: Pick<User, "name" | "phoneNumber">,
    passCode: string,
    roleIds: string[]
  ): Promise<User>;
  addRole(userId: string, roleId: string): Promise<{ roleId: string }>;
  findUserByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findUserById(userId: string): Promise<User | null>;
  findUsers(page: number, limit: number): Promise<User[]>;
}
