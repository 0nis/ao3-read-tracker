import { StorageService } from "../../services/storage";
import {
  extractWorkIdFromListingId,
  getWorkById,
  getWorksListFromListing,
} from "../../utils/ao3";
import { DisplayMode } from "../../enums/settings";
import { CollapseMode } from "../../enums/ui";
import { collapse } from "./rendering/display/collapse";
import { hide } from "./rendering/display/hide";
import { handleStorageRead } from "../../utils/storage/handlers";
import { IgnoredWork, ReadWork } from "../../types/works";

export async function getWorkStatusData(): Promise<
  | {
      elements: NodeListOf<HTMLLIElement>;
      readWorks: Record<string, ReadWork>;
      ignoredWorks: Record<string, IgnoredWork>;
    }
  | undefined
> {
  const worksList = getWorksListFromListing();
  if (!worksList) return;

  const elements = worksList.querySelectorAll<HTMLLIElement>("li.work");
  if (elements.length === 0) return;

  const workIds: string[] = [];
  for (const el of elements) {
    const id = extractWorkIdFromListingId(el.id);
    if (id) workIds.push(id);
  }

  const { readWorks, ignoredWorks } =
    (await handleStorageRead(StorageService.getByIds(workIds), {
      errorMsg: "Failed to retrieve stored work data.",
      errorOnUndefined: true,
      fallback: { readWorks: {}, ignoredWorks: {} },
    })) || {};

  return {
    elements,
    readWorks,
    ignoredWorks,
  };
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
