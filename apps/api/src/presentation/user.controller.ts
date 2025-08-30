import { UserUseCase } from "@application/use-case";
import { USER_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";

import { Request, Response } from "express";
import {
  AssignRoleRequestDTO,
  CreateUserRequestDTO,
  GetUserDetailRequestDTO,
  GetUsersRequestDTO,
} from "@pr80-app/shared-contracts";
import { UnauthorizedError } from "@application/errors";

const userUseCase = container.resolve<UserUseCase>(USER_USE_CASE);

export class UserController {
  static async create(
    req: Request<{}, {}, CreateUserRequestDTO>,
    res: Response
  ) {
    const { phoneNumber, passCode, roleIds = [], name } = req.body;

    const user = await userUseCase.createUser(
      {
        name,
        phoneNumber,
      },
      passCode,
      roleIds
    );
    res.status(201).json(user.toJSON());
  }

  static async assignRole(
    req: Request<{}, {}, AssignRoleRequestDTO>,
    res: Response
  ) {
    const { userId, roleName } = req.body;

    await userUseCase.assignRoleToUser(userId, roleName);

    res.status(200).json({ message: "Role assigned successfully" });
  }

  static async getAll(req: Request<{}, {}, GetUsersRequestDTO>, res: Response) {
    const { page = 1, limit = 20 } = req.query;

    const users = await userUseCase.getUsers(Number(page), Number(limit));

    res.status(200).json(users.map((user) => user.toJSON()));
  }

  static async getUserDetail(
    req: Request<GetUserDetailRequestDTO, {}, {}>,
    res: Response
  ) {
    const { userId } = req.params;
    if (!userId) {
      throw new UnauthorizedError("Missing user id");
    }

    const user = await userUseCase.getUserDetail(userId);

    res.status(200).json(user.toJSON());
  }
}
