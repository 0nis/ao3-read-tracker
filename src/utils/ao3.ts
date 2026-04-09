import { CLASS_PREFIX } from "../constants/classes";
import { warn } from "../shared/extension/logger";

export function getIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/works\/(\d+)/);
  if (!match) {
    warn("Could not extract work ID from URL");
    return null;
  }
  return match[1];
}

export function getTitleFromWorkPage(): string | null {
  const titleElement = document.querySelector("h2.title.heading");
  if (!titleElement || !titleElement.textContent) {
    warn("Could not find work title element");
    return null;
  }
  return titleElement.textContent.trim();
}

export function getCurrentChapterFromWorkPage(options?: {
  suppressWarnings?: boolean;
}): number | null {
  const titleElement = document.querySelector("h3.title");
  if (!titleElement) {
    if (!options?.suppressWarnings)
      warn("Could not find chapter title element");
    return null;
  }
  const chapterMatch = titleElement.textContent?.match(/Chapter (\d+)/);
  return chapterMatch ? parseInt(chapterMatch[1]) : null;
}

/**
 * Finds the newest chapter from a work listing element
 * When there are 12/? chapters, for example, it returns "12".
 */
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

/**
 * "Hijacking" meaning we change the page title and clear the
 * main content area to prepare it for our own content.
 */
export function hijackAo3Page(
  title: string,
  className: string,
): HTMLElement | null {
  document.title = title;
  const main = document.getElementById("main");
  if (!main) return null;
  main.innerHTML = "";
  main.className = `${CLASS_PREFIX}__${className}`;
  return main;
}

export function getWorkById(id: string): HTMLElement | null {
  return document.getElementById(`work_${id}`) as HTMLElement | null;
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

export function getWorkLinkFromId(id: string): string {
  return `https://archiveofourown.org/works/${id}`;
}
