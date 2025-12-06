import { buildIgnoreListSection, buildReadListSection } from "./lists";
import {
  buildGeneralSettingsSection,
  buildIgnoreSettingsSection,
  buildReadSettingsSection,
  buildInProgressSettingsSection,
} from "./settings";

export enum SectionId {
  READ_SETTINGS = "read-settings",
  IN_PROGRESS_SETTINGS = "in-progress-settings",
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
    id: SectionId.IN_PROGRESS_SETTINGS,
    label: "In Progress Settings",
    type: SectionType.SETTINGS,
    build: buildInProgressSettingsSection,
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
