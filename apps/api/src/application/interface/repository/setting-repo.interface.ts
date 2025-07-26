export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SettingRepository {
  /**
   * Retrieves all settings of type 'option'.
   * The result is a map where the key is the setting ID (e.g., 'orderStatuses')
   * and the value is the array of options.
   */
  getOption(): Promise<Record<string, SelectOption[]> | null>;

  /**
   * Retrieves a specific configuration setting by its key.
   * @param key The unique identifier for the configuration.
   */
  getConfig<T>(): Promise<Record<string, T> | null>;

  createOptions(
    key: string,
    belongTo: string,
    options: SelectOption[]
  ): Promise<void>;
  updateOptions(key: string, options: SelectOption[]): Promise<void>;

  createConfig(
    key: string,
    belongTo: string,
    data: Record<string, any>
  ): Promise<void>;
  updateConfig(key: string, data: Record<string, any>): Promise<void>;
}
