import { Settings } from "../types/settings";

export const VERSION: number = 1;

export const STORAGE_KEYS = {
  READ: "ao3ReadTracker_readFics",
  IGNORED: "ao3ReadTracker_ignoredFics",
  SETTINGS: "ao3ReadTracker_settings",
} as const;

export const SETTINGS_PAGE_URL = "/settings/mark-as-read";

export const DEFAULT_SETTINGS: Settings = {
  readDisplay: "collapse",
  ignoreDisplay: "collapse",
};
