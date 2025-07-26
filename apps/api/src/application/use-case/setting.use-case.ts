import {
  SelectOption,
  SettingRepository,
} from "@application/interface/repository";
import { v4 as uuid } from "uuid";

export class SettingUseCase {
  constructor(private readonly settingRepository: SettingRepository) {}

  async getSelectionOptions(): Promise<Record<string, SelectOption[]>> {
    const options = await this.settingRepository.getOption();
    return options || {};
  }

  async getSettingConfig<T>(): Promise<Record<string, T>> {
    const config = await this.settingRepository.getConfig<T>();
    return config || {};
  }

  async createTableOptions(options: SelectOption[]): Promise<void> {
    // Use a stable, predictable key instead of a random UUID.
    return this.settingRepository.createOptions(
      uuid(), // A fixed key
      "tables",
      options
    );
  }

  async createOrderStatusOptions(options: SelectOption[]): Promise<void> {
    // Use a stable, predictable key here as well.
    return this.settingRepository.createOptions(
      uuid(), // A fixed key
      "orderStatuses",
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
