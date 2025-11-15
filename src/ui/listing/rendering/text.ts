import { CLASS_PREFIX } from "../../../constants/classes";
import type { ReadFic, IgnoredFic } from "../../../types/storage";
import { getFormattedDate, getFormattedTime } from "../../../utils/date";
import { getOrCreateElement } from "../../../utils/dom";

/**
 * Adds text to a work element showing that it was marked as read/ignored, and any additional information.
 * @param work The fic to modify
 * @param type What information the text is for: "read" or "ignored"
 * @param item The item data containing optional additional information
 */
export function addText(
  work: HTMLElement,
  type: "read" | "ignored",
  item: ReadFic | IgnoredFic
) {
  addStyles();

  const indicatorList = getOrCreateElement(
    work,
    `${CLASS_PREFIX}__text-indicator`,
    "ul"
  );

  if (type === "read")
    renderReadInformation(work, indicatorList, item as ReadFic);
  else renderIgnoredInformation(work, indicatorList, item as IgnoredFic);
}

function renderReadInformation(
  work: HTMLElement,
  indicatorList: HTMLElement,
  item: ReadFic
) {
  indicatorList.appendChild(createIndicator("read", item.timestamp));
  if (item.notes) {
    addNotesText(work, item.notes, `${CLASS_PREFIX}__notes--read`);
  }
}

function renderIgnoredInformation(
  work: HTMLElement,
  indicatorList: HTMLElement,
  item: IgnoredFic
) {
  indicatorList.appendChild(createIndicator("ignored", item.timestamp));
  if (item.reason) {
    addNotesText(work, item.reason, `${CLASS_PREFIX}__notes--ignored`);
  }
}

function createIndicator(
  type: "read" | "ignored",
  timestamp: number
): HTMLElement {
  const indicator = document.createElement("li");
  indicator.classList.add(`${CLASS_PREFIX}__text-indicator--${type}`);
  const text = createIndicatorText(type, timestamp);
  indicator.appendChild(text);
  return indicator;
}

function createIndicatorText(
  type: "read" | "ignored",
  timestamp: number
): HTMLParagraphElement {
  const p = document.createElement("p");
  const timeEl = document.createElement("time");
  timeEl.dateTime = new Date(timestamp).toISOString();

  const formattedDate = getFormattedDate(timestamp);
  const formattedTime = getFormattedTime(timestamp);
  timeEl.textContent = `${formattedDate} at ${formattedTime}`;
  p.innerHTML = `Marked as ${type} on `;
  p.appendChild(timeEl);
  return p;
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
    }
  `;
  document.head.appendChild(style);
}
