import { Router } from "express";
import { SettingController } from "@presentation/setting.controller";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";
import {
  createSettingConfigValidator,
  createTableOptionsValidator,
  createOrderStatusOptionsValidator
} from "@presentation/validators/setting.validator";

export const settingRouter = Router();

settingRouter.get(
  "/settings/option",
  asyncHandler(SettingController.getOption)
);

settingRouter.get(
  "/settings/config",
  asyncHandler(SettingController.getConfig)
);

settingRouter.post(
  "/settings/config",
  createSettingConfigValidator,
  requestValidator,
  asyncHandler(SettingController.createConfig)
);

settingRouter.post(
  "/settings/option/tables",
  createTableOptionsValidator,
  requestValidator,
  asyncHandler(SettingController.createTableOptions)
);

settingRouter.post(
  "/settings/option/order-statuses",
  createOrderStatusOptionsValidator,
  requestValidator,
  asyncHandler(SettingController.createOrderStatusOptions)
);
