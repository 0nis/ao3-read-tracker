import { ButtonPlacement, DisplayMode } from "../constants/enums";
import { CollapseMode } from "../constants/settings";

export interface ReadFic {
  id: string;
  createdAt: number;
  modifiedAt: number;
  title?: string;
  rereadWorthy?: boolean;
  count?: number;
  notes?: string;
  isReading?: boolean;
  lastReadChapter?: number;
}

export interface IgnoredFic {
  id: string;
  createdAt: number;
  modifiedAt: number;
  title?: string;
  reason?: string;
}

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

export type FicData = {
  readFics: Record<string, ReadFic>;
  ignoredFics: Record<string, IgnoredFic>;
};

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
