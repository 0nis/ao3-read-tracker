import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";
import { StorageService } from "../../services/storage";
import { StorageResult } from "../../types/results";
import { SettingsData } from "../../types/settings";
import { buildIgnoreListSection } from "./components/sections/lists/ignored";
import { buildReadListSection } from "./components/sections/lists/read";
import { buildGeneralSettingsSection } from "./components/sections/settings/general";
import { buildIgnoreSettingsSection } from "./components/sections/settings/ignore";
import { buildReadSettingsSection } from "./components/sections/settings/read";

export enum SectionId {
  READ_SETTINGS = "read-settings",
  IGNORE_SETTINGS = "ignore-settings",
  GENERAL_SETTINGS = "general-settings",
  READ_LIST = "read-works",
  IGNORE_LIST = "ignored-works",
}

export enum SectionType {
  SETTINGS = "settings",
  LIST = "lists",
}

export type SectionBuilder = () => Promise<HTMLElement> | HTMLElement;

export interface SectionConfigItem {
  id: SectionId;
  label: string;
  type: SectionType;
  build: SectionBuilder;
}

export const SECTION_CONFIG: readonly SectionConfigItem[] = [
  {
    id: SectionId.READ_SETTINGS,
    label: "Read Settings",
    type: SectionType.SETTINGS,
    build: buildReadSettingsSection,
  },
  {
    id: SectionId.IGNORE_SETTINGS,
    label: "Ignore Settings",
    type: SectionType.SETTINGS,
    build: buildIgnoreSettingsSection,
  },
  {
    id: SectionId.GENERAL_SETTINGS,
    label: "General Settings",
    type: SectionType.SETTINGS,
    build: buildGeneralSettingsSection,
  },
  {
    id: SectionId.READ_LIST,
    label: "Read Works",
    type: SectionType.LIST,
    build: buildReadListSection,
  },
  {
    id: SectionId.IGNORE_LIST,
    label: "Ignored Works",
    type: SectionType.LIST,
    build: buildIgnoreListSection,
  },
] as const;

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
