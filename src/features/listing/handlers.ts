import { StorageService } from "../../services/storage";
import {
  extractWorkIdFromListingId,
  getWorkById,
  getWorksListFromListing,
} from "../../utils/ao3";
import type { SettingsData } from "../../types/settings";
import { ReadWork, IgnoredWork, WorkData } from "../../types/works";
import { createExtensionMsg } from "../../utils/extension/console";
import { CollapseMode, DisplayMode } from "../../constants/enums";
import { collapse } from "./rendering/collapse";
import { hide } from "./rendering/hide";

export async function getWorkStatusData(): Promise<{
  worksList: HTMLElement | null;
  data: WorkData | undefined | null;
}> {
  const worksList = getWorksListFromListing();
  if (!worksList) return { worksList: null, data: null };

  const items = Array.from(
    worksList.querySelectorAll<HTMLLIElement>("li.work")
  );
  if (items.length === 0) return { worksList, data: null };

  const workIds: string[] = [];
  for (const item of items) {
    const id = extractWorkIdFromListingId(item.id);
    if (id) workIds.push(id);
  }

  const storedDataResult = await StorageService.getByIds(workIds);
  if (!storedDataResult.success) {
    console.error(
      createExtensionMsg("Failed to retrieve stored work data:"),
      storedDataResult.error
    );
    return { worksList, data: null };
  }

  return { worksList, data: storedDataResult.data };
}

type DisplayRule = {
  name: string;
  shouldApply: () => boolean;
  getMode: () => DisplayMode;
};

export function collectDisplayRules(
  settings: SettingsData,
  read?: ReadWork,
  ignored?: IgnoredWork
): DisplayRule[] {
  return [
    {
      name: "ignored",
      shouldApply: () => !!ignored,
      getMode: () => settings.ignoreSettings.defaultDisplayMode,
    },
    {
      name: "still reading",
      shouldApply: () => !!read?.isReading,
      getMode: () => settings.readSettings.stillReadingDisplayMode,
    },
    {
      name: "reread worthy",
      shouldApply: () => !!read?.rereadWorthy,
      getMode: () => settings.readSettings.rereadWorthyDisplayMode,
    },
    {
      name: "read (default)",
      shouldApply: () => !!read,
      getMode: () => settings.readSettings.defaultDisplayMode,
    },
  ];
}

export function mapDisplayModeToFn(mode: DisplayMode) {
  switch (mode) {
    case DisplayMode.COLLAPSE_GENTLE:
      return collapse.bind(null, CollapseMode.GENTLE);
    case DisplayMode.COLLAPSE_AGGRESSIVE:
      return collapse.bind(null, CollapseMode.AGGRESSIVE);
    case DisplayMode.HIDE:
      return hide;
    default:
      return () => {};
  }
}

export function getWork(workOrId: HTMLElement | string): HTMLElement | null {
  if (typeof workOrId === "string") return getWorkById(workOrId);
  return workOrId;
}
