import { warn } from "../../shared/extension/logger";

export const getElement = (
  parent: HTMLElement,
  selector: string,
): HTMLElement | null => parent.querySelector(selector);

export function getWorkById(id: string): HTMLElement | null {
  return document.getElementById(`work_${id}`) as HTMLElement | null;
}

export function getWorkElement(
  workOrId: HTMLElement | string,
): HTMLElement | null {
  if (typeof workOrId === "string") return getWorkById(workOrId);
  return workOrId;
}

export function extractWorkIdFromListingId(id: string): string | null {
  const match = id.match(/^work_(\d+)/);
  return match ? match[1] : null;
}

export function getWorksListFromListing(): HTMLElement | null {
  const main = document.getElementById("main");
  if (!main?.classList.contains("works-index")) return null;
  const worksList = main.querySelector(
    "ol.work.index.group",
  ) as HTMLElement | null;
  if (!worksList) {
    warn("Could not find works list in listing page");
    return null;
  }
  return worksList;
}

export function getLatestChapterFromWorkListing(
  work: HTMLElement,
): number | null {
  const chapterElement = work.querySelector("dd.chapters");
  if (!chapterElement || !chapterElement.textContent) {
    warn("Could not find chapters element in work listing");
    return null;
  }
  const chapterMatch = chapterElement.textContent.match(/(\d+)\/\d+/);
  if (!chapterMatch || chapterMatch.length <= 0) {
    warn("Could not parse chapters from work listing");
    return null;
  }
  return parseInt(chapterMatch[1]);
}
