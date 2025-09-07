import { Request, Response } from "express";
import { AuthUseCase, UserUseCase } from "@application/use-case";
import { AUTH_USE_CASE, USER_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import {
  LoginRequestDTO,
  LoginResponseDTO,
  UserResponseDTO,
} from "@pr80-app/shared-contracts";
import { UnauthorizedError } from "@application/errors";

const authUseCase = container.resolve<AuthUseCase>(AUTH_USE_CASE);
const userUseCase = container.resolve<UserUseCase>(USER_USE_CASE);

export class AuthController {
  static async login(
    req: Request<{}, {}, LoginRequestDTO>,
    res: Response<LoginResponseDTO>
  ) {
    const { phoneNumber, passCode } = req.body;
    const { token, refreshToken } = await authUseCase.login(
      phoneNumber,
      passCode
    );
    res.status(200).json({ token, refreshToken });
  }

  static async getMe(req: Request, res: Response<UserResponseDTO>) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const user = await userUseCase.getUserDetail(userId);
    res.status(200).json(user.toJSON());
  }

  static async refreshToken(req: Request, res: Response<LoginResponseDTO>) {
    const { refreshToken } = req.body;
    const { token: newToken, refreshToken: newRefreshToken } =
      await authUseCase.refreshToken(refreshToken);
    res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  }
}
