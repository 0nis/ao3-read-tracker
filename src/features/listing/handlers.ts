import { StorageService } from "../../services/storage";
import {
  extractWorkIdFromListingId,
  getWorkById,
  getWorksListFromListing,
} from "../../utils/ao3";
import { WorkData } from "../../types/works";
import { DisplayMode } from "../../enums/settings";
import { CollapseMode } from "../../enums/ui";
import { collapse } from "./rendering/display/collapse";
import { hide } from "./rendering/display/hide";
import { handleStorageRead } from "../../utils/storage/handlers";

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

  const data = await handleStorageRead(StorageService.getByIds(workIds), {
    errorMsg: "Failed to retrieve stored work data.",
  });

  return { worksList, data: data };
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
