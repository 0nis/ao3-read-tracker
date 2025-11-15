import { StorageService } from "../../services/storage";
import {
  extractWorkIdFromListingId,
  getWorksListFromListing,
} from "../../utils/ao3";
import type { StorageData } from "../../types/storage";

export async function getFicStatusData(): Promise<{
  worksList: HTMLElement | null;
  data: Pick<StorageData, "readFics" | "ignoredFics"> | undefined | null;
}> {
  const worksList = getWorksListFromListing();
  if (!worksList) return { worksList: null, data: null };

  const items = Array.from(
    worksList.querySelectorAll<HTMLLIElement>("li.work")
  );
  if (items.length === 0) return { worksList, data: null };

  const ficIds = items
    .map((item) => extractWorkIdFromListingId(item.id))
    .filter((id): id is string => typeof id === "string");

  const storedDataResult = await StorageService.getByIds(ficIds);
  if (!storedDataResult.success) {
    console.error(
      "Failed to retrieve stored fic data:",
      storedDataResult.error
    );
    return { worksList, data: null };
  }

  return { worksList, data: storedDataResult.data };
}
