import { AsyncCache } from "./abstract";

import { handleGetAllSettings } from "../../utils/storage";
import { SettingsData } from "../../types/settings";

export class SettingsCache extends AsyncCache<SettingsData> {
  protected load(): Promise<SettingsData> {
    return handleGetAllSettings();
  }
}

export const settingsCache = new SettingsCache();
