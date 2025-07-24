import { UserRepository } from "@application/interface/repository";
import { JwtTokenService } from "@application/interface/service";
import { BadRequestError } from "@application/errors";

export class AuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtTokenService
  ) {}

  async login(phoneNumber: string, passCode: string) {
    const user = await this.userRepository.findUser(phoneNumber);

    if (!user || !user.isSamePassCode(passCode)) {
      throw new BadRequestError("Invalid credential");
    }

    // Use the service to generate a token
    const token = await this.jwtService.generateToken(
      {
        userId: user.id,
        roles: user.roles.map((role) => role.id),
      },
      {
        expiresIn: "7d",
      }
    );

    const refreshToken = await this.jwtService.generateToken(
      {
        userId: user.id,
        roles: user.roles.map((role) => role.id),
      },
      {
        expiresIn: "8d",
      }
    );

    return { token, refreshToken };
  }
}
