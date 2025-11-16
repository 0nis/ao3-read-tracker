import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkState } from "../../../constants/enums";
import type { ReadFic, IgnoredFic } from "../../../types/storage";
import { getLatestChapterFromWorkListing } from "../../../utils/ao3";
import { getFormattedDate, getFormattedTime } from "../../../utils/date";
import { getElement, getOrCreateElement } from "../../../utils/dom";

/**
 * Adds text to a work element showing that it was marked as read/ignored, and any additional information.
 * @param work The fic to modify
 * @param type What type of information the text is for, like a fic marked as read or ignored
 * @param item The item data containing optional additional information
 */
export function addText(
  work: HTMLElement,
  type: WorkState,
  item: ReadFic | IgnoredFic
) {
  addStyles();

  const indicatorList = getOrCreateElement(
    work,
    `${CLASS_PREFIX}__text-indicator`,
    "ul"
  );

  if (type === WorkState.READ)
    renderReadInformation(work, indicatorList, item as ReadFic);
  else renderIgnoredInformation(work, indicatorList, item as IgnoredFic);
}

/**
 * Removes any text added by this module from a work element.
 * @param work The fic to modify
 */
export function removeText(work: HTMLElement) {
  const elementsToRemove = [
    getElement(work, `.${CLASS_PREFIX}__text-indicator`),
    getElement(work, `.${CLASS_PREFIX}__text-indicator__notes`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

function renderReadInformation(
  work: HTMLElement,
  indicatorList: HTMLElement,
  item: ReadFic
) {
  if (item.notes)
    addNotesText(work, item.notes, `${CLASS_PREFIX}__notes--read`);
  if (item.isReading) {
    indicatorList.appendChild(
      createStillReadingText(work, item.modifiedAt, item.lastReadChapter)
    );
  } else {
    indicatorList.appendChild(createIndicator(WorkState.READ, item.modifiedAt));
  }
}

function renderIgnoredInformation(
  work: HTMLElement,
  indicatorList: HTMLElement,
  item: IgnoredFic
) {
  indicatorList.appendChild(createIndicator(WorkState.IGNORED, item.timestamp));
  if (item.reason)
    addNotesText(work, item.reason, `${CLASS_PREFIX}__notes--ignored`);
}

function createIndicator(type: WorkState, timestamp: number): HTMLElement {
  const indicator = document.createElement("li");
  indicator.classList.add(`${CLASS_PREFIX}__text-indicator--${type}`);
  const text = createIndicatorText(type, timestamp);
  indicator.appendChild(text);
  return indicator;
}

function createIndicatorText(
  type: WorkState,
  timestamp: number
): HTMLParagraphElement {
  const p = document.createElement("p");
  const timeEl = document.createElement("time");
  timeEl.dateTime = new Date(timestamp).toISOString();
  timeEl.textContent = `${getFormattedDate(timestamp)} at ${getFormattedTime(
    timestamp
  )}`;
  p.innerHTML = `Marked as ${type} on `;
  p.appendChild(timeEl);
  return p;
}

function createStillReadingText(
  work: HTMLElement,
  timestamp: number,
  chapter: number | undefined
): HTMLLIElement {
  const indicator = document.createElement("li");
  indicator.classList.add(`${CLASS_PREFIX}__text-indicator--still-reading`);

  const timeEl = document.createElement("time");
  timeEl.dateTime = new Date(timestamp).toISOString();
  timeEl.textContent = getFormattedDate(timestamp);

  const p = document.createElement("p");
  p.append(
    "Still reading as of ",
    timeEl,
    chapter
      ? ` (chapter ${chapter}/${getLatestChapterFromWorkListing(work) || "?"})`
      : ""
  );
  indicator.appendChild(p);

  return indicator;
}

function addNotesText(work: HTMLElement, notes: string, className?: string) {
  let section = work.querySelector(
    `.${CLASS_PREFIX}__text-indicator__notes`
  ) as HTMLElement | null;
  if (!section) {
    section = document.createElement("blockquote");
    section.classList.add(`${CLASS_PREFIX}__text-indicator__notes`);
    work.appendChild(section);
  }
  section.innerHTML += `
    <p>${notes}</p>
  `;
  if (className) section.classList.add(className);
}

export function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .${CLASS_PREFIX}__text-indicator {
      float: right;
      margin-top: 1em;
      text-align: right;
    }
    .${CLASS_PREFIX}__text-indicator li {
      padding: 0;
      margin: 0;
    }
    .${CLASS_PREFIX}__text-indicator li p {
      margin: 0.2em 0;
    }
    .${CLASS_PREFIX}__text-indicator__notes {
      float: left;
      margin-top: 1em !important;
    }
  `;
  document.head.appendChild(style);
}
