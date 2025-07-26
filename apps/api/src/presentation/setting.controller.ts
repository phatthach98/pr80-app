import { SettingUseCase } from "@application/use-case/setting.use-case";
import { container } from "@infras/di";
import { SETTING_USE_CASE } from "@infras/di/tokens";
import { NextFunction, Request, Response } from "express";

const settingUseCase = container.resolve<SettingUseCase>(SETTING_USE_CASE);

export class SettingController {
  static getOption = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const options = await settingUseCase.getSelectionOptions();
    res.status(200).json(options);
  };

  static getConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const config = await settingUseCase.getSettingConfig();
    res.status(200).json(config);
  };

  static createConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { key, data } = req.body;
    await settingUseCase.createSettingConfig(key, data);
    res.status(201).json({ message: "Config created successfully" });
  };

  static createTableOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { options } = req.body;
    await settingUseCase.createTableOptions(options);
    res.status(200).json({ message: "Table options updated successfully" });
  };

  static createOrderStatusOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { options } = req.body;
    await settingUseCase.createOrderStatusOptions(options);
    res
      .status(200)
      .json({ message: "Order status options updated successfully" });
  };
}
