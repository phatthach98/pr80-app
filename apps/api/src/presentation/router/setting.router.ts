import { Router } from "express";
import { SettingController } from "@presentation/setting.controller";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";

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
  asyncHandler(SettingController.createConfig)
);

settingRouter.post(
  "/settings/option/tables",
  asyncHandler(SettingController.createTableOptions)
);

settingRouter.post(
  "/settings/option/order-statuses",
  asyncHandler(SettingController.createOrderStatusOptions)
);
