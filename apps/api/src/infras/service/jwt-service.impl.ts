import { JwtTokenService } from "@application/interface/service";
import * as jwt from "jsonwebtoken";

export class JwtServiceImpl implements JwtTokenService {
  private readonly secret = process.env.JWT_SECRET || "your-super-secret-key";
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  generateToken(
    payload: { userId: string },
    options?: { expiresIn?: string }
  ): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: (options?.expiresIn || this.expiresIn) as any,
    });
  }

  async verifyToken<T>(token: string): Promise<T> {
    return jwt.verify(token, this.secret) as T;
  }
}
