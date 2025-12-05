import { ICache } from "./cache.interface";
import { SettingsData } from "../../types/settings";
import { handleGetAllSettings } from "../../utils/storage";

export class SettingsCache implements ICache<SettingsData> {
  private cache: SettingsData | null = null;

  async get(): Promise<SettingsData> {
    if (this.cache) return this.cache;
    this.cache = await handleGetAllSettings();
    return this.cache;
  }

  update(value: SettingsData): void {
    this.cache = value;
  }

  clear(): void {
    this.cache = null;
  }
}

export const settingsCache = new SettingsCache();
