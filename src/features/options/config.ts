import {
  buildGeneralSettingsSection,
  buildIgnoreSettingsSection,
  buildReadSettingsSection,
  buildInProgressSettingsSection,
  buildSymbolsSection,
} from "./settings";
import {
  buildIgnoredListSection,
  buildFinishedListSection,
  buildInProgressListSection,
} from "./lists";
import { buildDataSection, buildDisplayModesSection } from "./advanced";

export enum SectionId {
  FINISHED_SETTINGS = "finished-settings",
  IN_PROGRESS_SETTINGS = "in-progress-settings",
  IGNORE_SETTINGS = "ignore-settings",
  GENERAL_SETTINGS = "general-settings",
  SYMBOL_SETTINGS = "symbol-settings",
  FINISHED_LIST = "finished-works",
  IN_PROGRESS_LIST = "in-progress-works",
  IGNORE_LIST = "ignored-works",
  DATA = "data",
  DISPLAY_MODES = "display-modes",
}

export enum SectionType {
  SETTINGS = "settings",
  LIST = "lists",
  ADVANCED = "advanced",
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
    id: SectionId.FINISHED_SETTINGS,
    label: "Settings: Finished",
    type: SectionType.SETTINGS,
    build: buildReadSettingsSection,
  },
  {
    id: SectionId.IN_PROGRESS_SETTINGS,
    label: "Settings: In Progress",
    type: SectionType.SETTINGS,
    build: buildInProgressSettingsSection,
  },
  {
    id: SectionId.IGNORE_SETTINGS,
    label: "Settings: Ignored",
    type: SectionType.SETTINGS,
    build: buildIgnoreSettingsSection,
  },
  {
    id: SectionId.GENERAL_SETTINGS,
    label: "Settings: General",
    type: SectionType.SETTINGS,
    build: buildGeneralSettingsSection,
  },
  {
    id: SectionId.SYMBOL_SETTINGS,
    label: "Settings: Symbols",
    type: SectionType.SETTINGS,
    build: buildSymbolsSection,
  },
  {
    id: SectionId.FINISHED_LIST,
    label: "List: Finished Works",
    type: SectionType.LIST,
    build: buildFinishedListSection,
  },
  {
    id: SectionId.IN_PROGRESS_LIST,
    label: "List: In Progress Works",
    type: SectionType.LIST,
    build: buildInProgressListSection,
  },
  {
    id: SectionId.IGNORE_LIST,
    label: "List: Ignored Works",
    type: SectionType.LIST,
    build: buildIgnoredListSection,
  },
  {
    id: SectionId.DATA,
    label: "Data & Storage",
    type: SectionType.ADVANCED,
    build: buildDataSection,
  },
  {
    id: SectionId.DISPLAY_MODES,
    label: "Custom Display Modes",
    type: SectionType.ADVANCED,
    build: buildDisplayModesSection,
  },
] as const;

export interface NavConfigItem {
  label: string;
  type: SectionType;
}

export const NAV_CONFIG: readonly NavConfigItem[] = [
  {
    label: "Settings",
    type: SectionType.SETTINGS,
  },
  {
    label: "Lists",
    type: SectionType.LIST,
  },
  {
    label: "Advanced",
    type: SectionType.ADVANCED,
  },
];
