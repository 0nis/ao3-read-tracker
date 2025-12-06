import { StorageService } from "../../services/storage";
import {
  extractWorkIdFromListingId,
  getWorkById,
  getWorksListFromListing,
} from "../../utils/ao3";
import { handleStorageRead } from "../../utils/storage";
import { WorkData } from "../../types/works";

export async function getWorkStatusData(): Promise<
  ({ elements: NodeListOf<HTMLLIElement> } & WorkData) | undefined
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

  const { finishedWorks, inProgressWorks, ignoredWorks } =
    (await handleStorageRead(StorageService.getByIds(workIds), {
      errorMsg: "Failed to retrieve stored work data.",
      errorOnUndefined: true,
      fallback: { finishedWorks: {}, inProgressWorks: {}, ignoredWorks: {} },
    })) || {};

  return {
    elements,
    finishedWorks,
    inProgressWorks,
    ignoredWorks,
  };
}

export function getWork(workOrId: HTMLElement | string): HTMLElement | null {
  if (typeof workOrId === "string") return getWorkById(workOrId);
  return workOrId;
}
