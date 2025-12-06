import {
  buildIgnoreListSection,
  buildFinishedListSection,
  buildInProgressListSection,
} from "./lists";
import {
  buildGeneralSettingsSection,
  buildIgnoreSettingsSection,
  buildReadSettingsSection,
  buildInProgressSettingsSection,
} from "./settings";

export enum SectionId {
  FINISHED_SETTINGS = "finished-settings",
  IN_PROGRESS_SETTINGS = "in-progress-settings",
  IGNORE_SETTINGS = "ignore-settings",
  GENERAL_SETTINGS = "general-settings",
  FINISHED_LIST = "finished-works",
  IN_PROGRESS_LIST = "in-progress-works",
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
    id: SectionId.FINISHED_SETTINGS,
    label: "Finished Works Settings",
    type: SectionType.SETTINGS,
    build: buildReadSettingsSection,
  },
  {
    id: SectionId.IN_PROGRESS_SETTINGS,
    label: "In Progress Works Settings",
    type: SectionType.SETTINGS,
    build: buildInProgressSettingsSection,
  },
  {
    id: SectionId.IGNORE_SETTINGS,
    label: "Ignored Works Settings",
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
    id: SectionId.FINISHED_LIST,
    label: "Finished Works",
    type: SectionType.LIST,
    build: buildFinishedListSection,
  },
  {
    id: SectionId.IN_PROGRESS_LIST,
    label: "In Progress Works",
    type: SectionType.LIST,
    build: buildInProgressListSection,
  },
  {
    id: SectionId.IGNORE_LIST,
    label: "Ignored Works",
    type: SectionType.LIST,
    build: buildIgnoreListSection,
  },
] as const;
