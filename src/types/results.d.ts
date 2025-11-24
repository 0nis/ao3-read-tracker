import { ButtonPlacement, DisplayMode } from "../constants/enums";
import { CollapseMode } from "../constants/settings";

export interface ReadSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
  stillReadingDisplayMode: DisplayMode;
  rereadWorthyDisplayMode: DisplayMode;
}

export interface IgnoreSettings {
  id: string;
  simpleModeEnabled: boolean;
  defaultDisplayMode: DisplayMode;
}

export interface GeneralSettings {
  id: string;
  hideSymbols: boolean;
  buttonPlacement: ButtonPlacement;
  replaceMarkForLaterText: boolean;
  markForLaterReplacementLabel: string;
}

export type SettingsData = {
  readSettings: ReadSettings;
  ignoreSettings: IgnoreSettings;
  generalSettings: GeneralSettings;
};

export type StorageResult<T = void> = {
  data?: T;
  error?: unknown;
  success: boolean;
};

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
