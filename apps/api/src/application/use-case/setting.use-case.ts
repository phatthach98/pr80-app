import { SettingRepository } from "@application/interface/repository";
import { v4 as uuid } from "uuid";
import { SelectOption } from "../../types";

export class SettingUseCase {
  constructor(private readonly settingRepository: SettingRepository) {}

  async getSelectionOptions(): Promise<
    Record<string, SelectOption[]>
  > {
    const options = await this.settingRepository.getOption();
    return options || { tables: [], orderStatuses: [] };
  }

  async getSettingConfig(): Promise<Record<string, SelectOption[]>> {
    const config = await this.settingRepository.getConfig();
    return config;
  }

  async createOptions(key: string, options: SelectOption[]): Promise<void> {
    return this.settingRepository.createOptions(
      uuid(),
      key,
      options
    );
  }

  async createSettingConfig(key: string, config: any): Promise<void> {
    // Similarly, the key for a config should likely be stable.
    // The `uuid()` here was probably also not the intended behavior.
    return this.settingRepository.createConfig(uuid(), key, config);
  }

  async updateSettingConfig(key: string, config: any): Promise<void> {
    return this.settingRepository.updateConfig(key, config);
  }

  async updateSettingOptions(
    key: string,
    options: SelectOption[]
  ): Promise<void> {
    return this.settingRepository.updateOptions(key, options);
  }
}
