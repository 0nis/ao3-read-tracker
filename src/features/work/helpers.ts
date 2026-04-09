import { warn } from "../../shared/extension/logger";
import { VerticalPlacement } from "../../enums/settings";

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

export function placeNotice(
  main: HTMLElement,
  notice: HTMLElement,
  placement: VerticalPlacement,
) {
  if (placement === VerticalPlacement.BOTTOM) {
    const el = main.querySelector("#feedback")?.querySelector("ul.actions");
    if (el) {
      el.after(notice);
      return;
    }

    warn(
      "Could not find #feedback.ul.actions to insert flash notice after. Prepending to main instead.",
    );
  }

  main.prepend(notice);
}
