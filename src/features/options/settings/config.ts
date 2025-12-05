import { SectionId } from "../config";
import { StorageService } from "../../../services/storage";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../../constants/settings";
import type { StorageResult } from "../../../types/results";
import type {
  GeneralSettings,
  IgnoreSettings,
  ReadSettings,
  SettingsData,
} from "../../../types/settings";

export interface SettingsSectionTypeMap {
  [SectionId.READ_SETTINGS]: ReadSettings;
  [SectionId.IGNORE_SETTINGS]: IgnoreSettings;
  [SectionId.GENERAL_SETTINGS]: GeneralSettings;
}

export const SETTINGS_LOAD_MAP: Partial<
  Record<SectionId, (s: SettingsData) => any>
> = {
  [SectionId.READ_SETTINGS]: (s) => s.readSettings,
  [SectionId.IGNORE_SETTINGS]: (s) => s.ignoreSettings,
  [SectionId.GENERAL_SETTINGS]: (s) => s.generalSettings,
};

export interface SaveMapEntry<T> {
  defaults: T;
  setter: (v: T) => Promise<StorageResult<void>>;
  label: string;
}

export const SETTINGS_SAVE_MAP: {
  [K in keyof SettingsSectionTypeMap]: SaveMapEntry<SettingsSectionTypeMap[K]>;
} = {
  [SectionId.READ_SETTINGS]: {
    defaults: DEFAULT_READ_SETTINGS,
    setter: StorageService.readSettings.set,
    label: "read settings",
  },
  [SectionId.IGNORE_SETTINGS]: {
    defaults: DEFAULT_IGNORE_SETTINGS,
    setter: StorageService.ignoreSettings.set,
    label: "ignore settings",
  },
  [SectionId.GENERAL_SETTINGS]: {
    defaults: DEFAULT_GENERAL_SETTINGS,
    setter: StorageService.generalSettings.set,
    label: "general settings",
  },
};
