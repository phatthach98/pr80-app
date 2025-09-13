import { UserRepository } from "@application/interface/repository";
import { JwtTokenService } from "@application/interface/service";
import { BadRequestError, NotFoundError } from "@application/errors";

export class AuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtTokenService
  ) {}

  async login(phoneNumber: string, passCode: string) {
    const user = await this.userRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || !user.isSamePassCode(passCode)) {
      throw new BadRequestError("Invalid credential");
    }

    const { token, refreshToken } = await this.generateTokenAndRefreshToken(
      user.id,
      user.roles.map((role) => role.id)
    );

    return { token, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const decoded = await this.jwtService.verifyToken<{
      userId: string;
      roles: string[];
    }>(refreshToken);

    const user = await this.userRepository.findUserById(decoded.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { token: newToken, refreshToken: newRefreshToken } =
      await this.generateTokenAndRefreshToken(
        user.id,
        user.roles.map((role) => role.id)
      );

    return { token: newToken, refreshToken: newRefreshToken };
  }

  private async generateTokenAndRefreshToken(
    userId: string,
    roleIds: string[]
  ) {
    const token = await this.jwtService.generateToken(
      {
        userId: userId,
        roles: roleIds,
      },
      {
        expiresIn: "7d",
      }
    );

    const refreshToken = await this.jwtService.generateToken(
      {
        userId: userId,
        roles: roleIds,
      },
      {
        expiresIn: "14d",
      }
    );

    return { token, refreshToken };
  }
}
