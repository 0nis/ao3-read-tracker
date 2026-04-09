import { CLASS_PREFIX } from "../constants/classes";
import { warn } from "../shared/extension/logger";

// TODO: Move file to /shared/

export function getIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/works\/(\d+)/);
  if (!match) {
    warn("Could not extract work ID from URL");
    return null;
  }
  return match[1];
}

export const getWorkTitleForNotifications = (
  title: string | undefined,
): string => {
  return String(title) || "this work";
};

// TODO: Move to relevant feature
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

export function getWorkLinkFromId(id: string): string {
  return `https://archiveofourown.org/works/${id}`;
}
