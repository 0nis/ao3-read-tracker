import {
  buildFinishedSettingsSection,
  buildFinishedListSection,
  buildInProgressSettingsSection,
  buildInProgressListSection,
  buildIgnoreSettingsSection,
  buildIgnoredListSection,
  buildGeneralSettingsSection,
  buildSymbolsSection,
  buildDataSection,
  buildDisplayModesSection,
} from "./pages";

export enum SectionId {
  FINISHED_SETTINGS = "finished-settings",
  IN_PROGRESS_SETTINGS = "in-progress-settings",
  IGNORE_SETTINGS = "ignore-settings",
  GENERAL_SETTINGS = "general-settings",
  SYMBOL_SETTINGS = "symbol-settings",
  FINISHED_LIBRARY = "finished-works",
  IN_PROGRESS_LIBRARY = "in-progress-works",
  IGNORE_LIBRARY = "ignored-works",
  DATA = "data",
  DISPLAY_MODES = "display-modes",
}

export enum SectionType {
  SETTINGS = "settings",
  LIST = "lists",
  ADVANCED = "advanced",
  DISPLAY = "display",
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
    label: "Finished Settings",
    type: SectionType.SETTINGS,
    build: buildFinishedSettingsSection,
  },
  {
    id: SectionId.IN_PROGRESS_SETTINGS,
    label: "In Progress Settings",
    type: SectionType.SETTINGS,
    build: buildInProgressSettingsSection,
  },
  {
    id: SectionId.IGNORE_SETTINGS,
    label: "Ignored Settings",
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
    id: SectionId.FINISHED_LIBRARY,
    label: "Finished Works Library",
    type: SectionType.LIST,
    build: buildFinishedListSection,
  },
  {
    id: SectionId.IN_PROGRESS_LIBRARY,
    label: "In Progress Works Library",
    type: SectionType.LIST,
    build: buildInProgressListSection,
  },
  {
    id: SectionId.IGNORE_LIBRARY,
    label: "Ignored Works Library",
    type: SectionType.LIST,
    build: buildIgnoredListSection,
  },
  {
    id: SectionId.SYMBOL_SETTINGS,
    label: "Symbol Modification",
    type: SectionType.DISPLAY,
    build: buildSymbolsSection,
  },
  {
    id: SectionId.DISPLAY_MODES,
    label: "Custom Display Modes",
    type: SectionType.DISPLAY,
    build: buildDisplayModesSection,
  },
  {
    id: SectionId.DATA,
    label: "Data & Storage",
    type: SectionType.ADVANCED,
    build: buildDataSection,
  },
] as const;

export interface NavConfigItem {
  label: string;
  type: SectionType;
}

export const NAV_CONFIG: readonly NavConfigItem[] = [
  {
    label: "LIBRARIES",
    type: SectionType.LIST,
  },
  {
    label: "SETTINGS",
    type: SectionType.SETTINGS,
  },
  {
    label: "DISPLAY",
    type: SectionType.DISPLAY,
  },
  {
    label: "ADVANCED",
    type: SectionType.ADVANCED,
  },
];
