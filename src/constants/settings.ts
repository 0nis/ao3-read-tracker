import { ButtonPlacement, DisplayMode, SettingsType } from "./enums";
import {
  GeneralSettings,
  IgnoreSettings,
  ReadSettings,
} from "../types/storage";

export const VERSION: number = 1;

export const DATABASE_NAME = "Ao3MarkAsReadDB";
export const DATABASE_VERSION = VERSION;

export const SETTINGS_PAGE_URL = "/settings/mark-as-read";

export const DEFAULT_READ_SETTINGS: ReadSettings = {
  id: SettingsType.READ,
  simpleModeEnabled: true,
  defaultDisplayMode: DisplayMode.COLLAPSE_GENTLE,
  stillReadingDisplayMode: DisplayMode.NONE,
  rereadWorthyDisplayMode: DisplayMode.COLLAPSE_GENTLE,
};

export const DEFAULT_IGNORE_SETTINGS: IgnoreSettings = {
  id: SettingsType.IGNORE,
  simpleModeEnabled: false,
  defaultDisplayMode: DisplayMode.COLLAPSE_AGGRESSIVE,
};

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  id: SettingsType.GENERAL,
  hideSymbols: false,
  buttonPlacement: ButtonPlacement.TOP,
};
