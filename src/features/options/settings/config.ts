import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "@constants";
import { StorageResult, SettingsData } from "@types";
import { StorageService } from "@services/storage";

import { SectionId } from "../config";

export const SETTINGS_LOAD_MAP: Partial<
  Record<SectionId, (s: SettingsData) => any>
> = {
  [SectionId.READ_SETTINGS]: (s) => s.readSettings,
  [SectionId.IGNORE_SETTINGS]: (s) => s.ignoreSettings,
  [SectionId.GENERAL_SETTINGS]: (s) => s.generalSettings,
};

export const SETTINGS_SAVE_MAP: Partial<
  Record<
    SectionId,
    {
      defaults: object;
      setter: (v: any) => Promise<StorageResult<void>>;
      label: string;
    }
  >
> = {
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
