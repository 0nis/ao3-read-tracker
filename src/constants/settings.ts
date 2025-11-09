import { Settings } from "../types/storage";

export const VERSION: number = 1;

export const DATABASE_NAME = "Ao3MarkAsReadDB";
export const DATABASE_VERSION = VERSION;

export const SETTINGS_PAGE_URL = "/settings/mark-as-read";

export const READ_SETTINGS_ID: string = "READ_SETTINGS";
export const IGNORE_SETTINGS_ID: string = "IGNORE_SETTINGS";

export const COLLAPSE_MODE = {
  GENTLE: "gentle",
  AGGRESSIVE: "aggressive",
} as const;

export const DEFAULT_READ_SETTINGS: Settings = {
  id: READ_SETTINGS_ID,
  simpleMode: true,
  collapse: true,
  collapseMode: COLLAPSE_MODE.GENTLE,
};

export const DEFAULT_IGNORE_SETTINGS: Settings = {
  id: IGNORE_SETTINGS_ID,
  simpleMode: true,
  collapse: true,
  collapseMode: COLLAPSE_MODE.AGGRESSIVE,
};
