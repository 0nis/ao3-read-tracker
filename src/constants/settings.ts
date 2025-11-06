import { Settings } from "../types/settings";

export const VERSION: number = 1;

export const DATABASE_NAME = "Ao3MarkAsReadDB";
export const DATABASE_VERSION = VERSION;

export const SETTINGS_PAGE_URL = "/settings/mark-as-read";

export const DEFAULT_SETTINGS: Settings = {
  readDisplay: "collapse",
  ignoreDisplay: "collapse",
};
