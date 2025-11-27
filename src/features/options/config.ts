import { buildIgnoreListSection, buildReadListSection } from "./lists";
import {
  buildGeneralSettingsSection,
  buildIgnoreSettingsSection,
  buildReadSettingsSection,
} from "./settings";

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

export type SectionElements = {
  [key in SectionId]: {
    element: HTMLElement;
    type: SectionType;
  };
};

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
