import { SectionId } from "../config";
import { StorageService } from "../../../services/storage";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_IN_PROGRESS_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../../constants/settings";
import type { StorageResult } from "../../../types/results";
import type {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  ReadSettings,
} from "../../../types/settings";

export interface SettingsSectionTypeMap {
  [SectionId.READ_SETTINGS]: ReadSettings;
  [SectionId.IN_PROGRESS_SETTINGS]: InProgressSettings;
  [SectionId.IGNORE_SETTINGS]: IgnoreSettings;
  [SectionId.GENERAL_SETTINGS]: GeneralSettings;
}

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
  [SectionId.IN_PROGRESS_SETTINGS]: {
    defaults: DEFAULT_IN_PROGRESS_SETTINGS,
    setter: StorageService.inProgressSettings.set,
    label: "in progress settings",
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
