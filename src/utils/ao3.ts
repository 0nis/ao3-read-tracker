import { CLASS_PREFIX } from "../constants/classes";

export function getIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/works\/(\d+)/);
  return match ? match[1] : null;
}

export function getTitleFromWorkPage(): string | null {
  const titleElement = document.querySelector("h2.title.heading");
  return titleElement ? titleElement.textContent?.trim() || null : null;
}

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

export function extractWorkIdFromListingId(id: string): string | null {
  const match = id.match(/^work_(\d+)/);
  return match ? match[1] : null;
}

export function getWorksListFromListing(): HTMLElement | null {
  const main = document.getElementById("main");
  if (!main?.classList.contains("works-index")) return null;
  return main.querySelector("ol.work.index.group");
}
