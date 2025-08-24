import { Request, Response } from "express";
import { AuthUseCase } from "@application/use-case";
import { AUTH_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import { LoginRequestDTO } from "@pr80-app/shared-contracts";

const authUseCase = container.resolve<AuthUseCase>(AUTH_USE_CASE);

export class AuthController {
  static async login(req: Request<{}, {}, LoginRequestDTO>, res: Response) {
    const { phoneNumber, passCode } = req.body;
    const { token, refreshToken } = await authUseCase.login(
      phoneNumber,
      passCode
    );
    res.status(200).json({ token, refreshToken });
  }
}
