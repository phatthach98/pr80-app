import { DIContainer } from "./container";
import * as TOKENS from "./tokens";

// Import UseCases
import { AuthUseCase, UserUseCase, RoleUseCase, DishUseCase, OrderUseCase } from "@application/use-case";
import { SettingUseCase } from "@application/use-case/setting.use-case";
import { DishOptionUseCase } from "@application/use-case/dish-option.use-case";

// Import Implementations
import {
  UserRepoImpl,
  RoleRepoImpl,
  SettingRepoImpl,
  DishOptionRepositoryImpl,
  DishRepositoryImpl,
  OrderRepositoryImpl,
} from "@infras/database/repo-impl";
import { JwtServiceImpl, SocketServiceImpl } from "@infras/service";
// Create the container instance
export const container = new DIContainer();

// --- Register all dependencies ---

// Services (no dependencies)
container.register(TOKENS.JWT_TOKEN_SERVICE, JwtServiceImpl);
// Socket service depends on JWT service for authentication
container.register(TOKENS.SOCKET_SERVICE, SocketServiceImpl, [TOKENS.JWT_TOKEN_SERVICE]);

// Repositories (no dependencies)
container.register(TOKENS.USER_REPOSITORY, UserRepoImpl);
container.register(TOKENS.ROLE_REPOSITORY, RoleRepoImpl);
container.register(TOKENS.SETTING_REPOSITORY, SettingRepoImpl);
container.register(TOKENS.DISH_OPTION_REPOSITORY, DishOptionRepositoryImpl);
container.register(TOKENS.DISH_REPOSITORY, DishRepositoryImpl);
// Order repository has no dependencies
container.register(TOKENS.ORDER_REPOSITORY, OrderRepositoryImpl);

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

container.register(TOKENS.DISH_OPTION_USE_CASE, DishOptionUseCase, [
  TOKENS.DISH_OPTION_REPOSITORY,
]);

container.register(TOKENS.DISH_USE_CASE, DishUseCase, [
  TOKENS.DISH_REPOSITORY,
  TOKENS.DISH_OPTION_REPOSITORY,
]);

// Register OrderUseCase with socket service for real-time updates
container.register(TOKENS.ORDER_USE_CASE, OrderUseCase, [
  TOKENS.ORDER_REPOSITORY,
  TOKENS.DISH_REPOSITORY,
  TOKENS.DISH_OPTION_REPOSITORY,
  TOKENS.SOCKET_SERVICE
]);
