import { UserRepository } from "@application/interface/repository/user-repo.interface";
import { Permission } from "@domain/entity/permission";
import { Role } from "@domain/entity/role";
import { User } from "@domain/entity/user";
import { UserModel } from "@infras/database/schemas";
import { E_ROLE_NAME } from "@pr80-app/shared-contracts";

export class UserRepoImpl implements UserRepository {
  async create(
    userData: Pick<User, "name" | "phoneNumber">,
    passCode: string,
    roleIds: string[]
  ): Promise<User> {
    const newUser = User.create(userData.name, userData.phoneNumber, passCode);

    const userToSave = {
      _id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      roles: roleIds,
      passCode: passCode,
    };

    const createdUserDoc = await UserModel.create(userToSave);
    const populatedUserDoc = await createdUserDoc.populate("populatedRoles");

    return this.mapDocToUser(populatedUserDoc);
  }

  async addRole(userId: string, roleId: string): Promise<{ roleId: string }> {
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { roles: { id: roleId } } }
    );

    return { roleId };
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ phoneNumber })
      .populate("populatedRoles")
      .lean();

    if (!userDoc) {
      return null;
    }

    return this.mapDocToUser(userDoc);
  }

  async findUserById(userId: string): Promise<User | null> {
    const userDoc = await UserModel.findById(userId)
      .populate("populatedRoles")
      .lean();

    if (!userDoc) {
      return null;
    }

    return this.mapDocToUser(userDoc);
  }

  async findUsers(page: number, limit: number): Promise<User[]> {
    const users = await UserModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("populatedRoles")
      .lean();

    return users.map((userDoc) => this.mapDocToUser(userDoc));
  }

  private mapDocToUser(userDoc: any): User {
    const user = new User(
      userDoc._id.toString(),
      userDoc.name,
      userDoc.phoneNumber,
      userDoc.passCode
    );

    if (userDoc.populatedRoles) {
      userDoc.populatedRoles.forEach((roleDoc: Role) => {
        const role = this.mapDocToRole(roleDoc);
        user.addRole(role);
      });
    }

    return user;
  }

  private mapDocToRole(roleDoc: any): Role {
    const role = new Role(
      roleDoc._id.toString(),
      roleDoc.name as E_ROLE_NAME,
      roleDoc.description
    );

    if (roleDoc.permissions) {
      roleDoc.permissions.forEach((p: string) => {
        try {
          role.addPermission(Permission.fromString(p));
        } catch (error) {
          console.error(`Skipping malformed permission: ${p}`, error);
        }
      });
    }
    return role;
  }
}
