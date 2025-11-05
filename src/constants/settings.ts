import { Settings } from "../types/settings";

export const VERSION: number = 1;

export const STORAGE_KEYS = {
  READ: "ao3MarkAsRead_read",
  IGNORED: "ao3MarkAsRead_ignored",
  SETTINGS: "ao3MarkAsRead_settings",
} as const;

export const SETTINGS_PAGE_URL = "/settings/mark-as-read";

export const DEFAULT_SETTINGS: Settings = {
  readDisplay: "collapse",
  ignoreDisplay: "collapse",
};
