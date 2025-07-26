export interface JwtPayload {
  userId: string;
  roles: string[];
}
export interface JwtTokenService {
  generateToken(
    payload: JwtPayload,
    options?: {
      expiresIn?: string;
    }
  ): string;
  verifyToken<T>(token: string): Promise<T>;
}
