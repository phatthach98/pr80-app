import { SettingRepository } from "@application/interface/repository/setting-repo.interface";
import { SettingModel } from "@infras/database/schemas";
import { SelectOption } from "@pr80-app/shared-contracts";

export class SettingRepoImpl implements SettingRepository {
  async getOption(): Promise<Record<string, SelectOption[]>> {
    const optionDocs = await SettingModel.find({ type: "option" }).lean();

    if (!optionDocs) {
      return {};
    }

    const aggregatedOptions = optionDocs.reduce((acc, doc) => {
      const key = doc.belongTo;
      acc[key] = doc.data as SelectOption[];
      return acc;
    }, {} as Record<string, SelectOption[]>);

    return aggregatedOptions;
  }

  async getConfig<T>(): Promise<Record<string, T>> {
    const configDoc = await SettingModel.find({
      type: "config",
    }).lean();

    if (!configDoc) {
      return {};
    }

    const aggregatedConfigs = configDoc.reduce((acc, doc) => {
      const key = doc.belongTo;
      acc[key] = doc.data as T;
      return acc;
    }, {} as Record<string, T>);

    return aggregatedConfigs;
  }

  async createOptions(
    key: string,
    belongTo: string,
    options: SelectOption[]
  ): Promise<void> {
    await SettingModel.create({
      _id: key,
      type: "option",
      belongTo,
      data: options,
    });
  }

  async updateOptions(key: string, options: SelectOption[]): Promise<void> {
    await SettingModel.updateOne({ _id: key }, { $set: { data: options } });
  }

  async createConfig(key: string, belongTo: string, data: any): Promise<void> {
    await SettingModel.create({
      _id: key,
      type: "config",
      belongTo,
      data,
    });
  }

  async updateConfig(key: string, data: any): Promise<void> {
    await SettingModel.updateOne({ _id: key }, { $set: { data: data } });
  }
}
