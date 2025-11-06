import { db } from "./db";
import { DEFAULT_SETTINGS } from "../constants/settings";
import { Settings } from "../types/settings";
import { IgnoredFic, ReadFic } from "../types/storage";
import { BaseData } from "./base";

export const ReadFicsData = new BaseData<ReadFic>(db.readFics);
export const IgnoredFicsData = new BaseData<IgnoredFic>(db.ignoredFics);
export const SettingsData = {
  async get(): Promise<Settings> {
    const row = await db.settings.get("settings");
    return row?.data ?? DEFAULT_SETTINGS;
  },

  async set(settings: Settings): Promise<void> {
    await db.settings.put({ id: "settings", data: settings });
  },

  async clear(): Promise<void> {
    await db.settings.clear();
  },

  async replace(settings: Settings) {
    await db.transaction("rw", db.settings, async () => {
      await this.clear();
      await this.set(settings);
    });
  },
};
