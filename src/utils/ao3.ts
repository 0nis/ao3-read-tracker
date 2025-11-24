import { CLASS_PREFIX } from "../constants/classes";

export function getIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/works\/(\d+)/);
  return match ? match[1] : null;
}

export function getTitleFromWorkPage(): string | null {
  const titleElement = document.querySelector("h2.title.heading");
  return titleElement ? titleElement.textContent?.trim() || null : null;
}

export function getCurrentChapterFromWorkPage(): number | null {
  const titleElement = document.querySelector("h3.title");
  if (!titleElement) return null;
  const chapterMatch = titleElement.textContent?.match(/Chapter (\d+)/);
  return chapterMatch ? parseInt(chapterMatch[1]) : null;
}

/**
 * Finds the newest chapter from a work listing element
 * When there are 12/? chapters, for example, it returns "12".
 */
export function getLatestChapterFromWorkListing(
  work: HTMLElement
): number | null {
  const chapterElement = work.querySelector("dd.chapters");
  if (!chapterElement) return null;
  const chapterMatch = chapterElement.textContent?.match(/(\d+)\/\d+/);
  return chapterMatch ? parseInt(chapterMatch[1]) : null;
}

/**
 * "Hijacking" meaning we change the page title and clear the
 * main content area to prepare it for our own content.
 */
export function hijackAo3Page(
  title: string,
  className: string
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
  return main.querySelector("ol.work.index.group");
}

export function getWorkLinkFromId(id: string): string {
  return `https://archiveofourown.org/works/${id}`;
}
