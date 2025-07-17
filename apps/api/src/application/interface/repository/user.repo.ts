import { User } from "@/domain/entity/user";

export interface UserRepository {
  create(
    user: Pick<User, "name" | "phoneNumber">,
    passCode: string,
    roleIds: string[]
  ): Promise<User>;
  addRole(userId: string, roleId: string): Promise<void>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
}
