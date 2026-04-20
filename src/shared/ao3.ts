import { CLASS_PREFIX } from "../constants/classes";
import { warn } from "./extension/logger";

/** @returns Work ID from URL */
export function getIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/works\/(\d+)/);
  if (!match) {
    warn("Could not extract work ID from URL");
    return null;
  }
  return match[1];
}

/** @returns Your title or "this work" */
export const getWorkTitleForNotifications = (
  title: string | undefined,
): string => {
  return String(title) || "this work";
};

/**
 * Politely evicts the existing content so ours can move in.
 * Nothing sinister, promise ;)
 * @param title New document title (overwrites existing)
 * @param className New classname of the main element (overwrites existing)
 * @returns <main> element
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
