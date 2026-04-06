import { SectionId } from "../../config";
import { StorageService } from "../../../../services/storage";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_IN_PROGRESS_SETTINGS,
  DEFAULT_FINISHED_SETTINGS,
  DEFAULT_SYMBOL_SETTINGS,
} from "../../../../constants/settings";
import type { StorageResult } from "../../../../types/storage";
import type {
  GeneralSettings,
  IgnoreSettings,
  InProgressSettings,
  FinishedSettings,
  SymbolSettings,
} from "../../../../types/settings";

export interface SettingsSectionTypeMap {
  [SectionId.FINISHED_SETTINGS]: FinishedSettings;
  [SectionId.IN_PROGRESS_SETTINGS]: InProgressSettings;
  [SectionId.IGNORE_SETTINGS]: IgnoreSettings;
  [SectionId.GENERAL_SETTINGS]: GeneralSettings;
  [SectionId.SYMBOL_SETTINGS]: SymbolSettings;
}

export interface SaveMapEntry<T> {
  defaults: T;
  setter: (v: T) => Promise<StorageResult<void>>;
  label: string;
}

export const SETTINGS_SAVE_MAP: {
  [K in keyof SettingsSectionTypeMap]: SaveMapEntry<SettingsSectionTypeMap[K]>;
} = {
  [SectionId.FINISHED_SETTINGS]: {
    defaults: DEFAULT_FINISHED_SETTINGS,
    setter: StorageService.finishedSettings.set,
    label: "finished works settings",
  },
  [SectionId.IN_PROGRESS_SETTINGS]: {
    defaults: DEFAULT_IN_PROGRESS_SETTINGS,
    setter: StorageService.inProgressSettings.set,
    label: "in progress works settings",
  },
  [SectionId.IGNORE_SETTINGS]: {
    defaults: DEFAULT_IGNORE_SETTINGS,
    setter: StorageService.ignoreSettings.set,
    label: "ignored works settings",
  },
  [SectionId.GENERAL_SETTINGS]: {
    defaults: DEFAULT_GENERAL_SETTINGS,
    setter: StorageService.generalSettings.set,
    label: "general settings",
  },
  [SectionId.SYMBOL_SETTINGS]: {
    defaults: DEFAULT_SYMBOL_SETTINGS,
    setter: StorageService.symbolSettings.set,
    label: "symbol settings",
  },
};
