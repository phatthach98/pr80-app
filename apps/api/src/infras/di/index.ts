import { DIContainer } from "./container";
import * as TOKENS from "./tokens";

// Import UseCases
import { AuthUseCase, UserUseCase, RoleUseCase } from "@application/use-case";
import { SettingUseCase } from "@application/use-case/setting.use-case";

// Import Implementations
import {
  UserRepoImpl,
  RoleRepoImpl,
  SettingRepoImpl,
} from "@infras/database/repo-impl";
import { JwtServiceImpl } from "@infras/service";
// Create the container instance
export const container = new DIContainer();

// --- Register all dependencies ---

// Services (no dependencies)
container.register(TOKENS.JWT_TOKEN_SERVICE, JwtServiceImpl);

// Repositories (no dependencies)
container.register(TOKENS.USER_REPOSITORY, UserRepoImpl);
container.register(TOKENS.ROLE_REPOSITORY, RoleRepoImpl);
container.register(TOKENS.SETTING_REPOSITORY, SettingRepoImpl);

// UseCases (with dependencies)
container.register(TOKENS.AUTH_USE_CASE, AuthUseCase, [
  TOKENS.USER_REPOSITORY,
  TOKENS.JWT_TOKEN_SERVICE,
]);

container.register(TOKENS.USER_USE_CASE, UserUseCase, [
  TOKENS.USER_REPOSITORY,
  TOKENS.ROLE_REPOSITORY,
]);

container.register(TOKENS.ROLE_USE_CASE, RoleUseCase, [TOKENS.ROLE_REPOSITORY]);

container.register(TOKENS.SETTING_USE_CASE, SettingUseCase, [
  TOKENS.SETTING_REPOSITORY,
]);
