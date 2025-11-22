import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkState } from "../../../constants/enums";
import type { ReadFic, IgnoredFic } from "../../../types/storage";
import { getLatestChapterFromWorkListing } from "../../../utils/ao3";
import { getFormattedDate, getFormattedTime } from "../../../utils/date";
import { el, ensureChild, getElement, injectStyles } from "../../../utils/dom";

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
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-text`,
    getStyles(CLASS_PREFIX)
  );

  const indicatorList = ensureChild(
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
  return el(
    "li",
    {
      className: `${CLASS_PREFIX}__text-indicator--${type}`,
    },
    [createIndicatorText(type, timestamp)]
  );
}

function createIndicatorText(
  type: WorkState,
  timestamp: number
): HTMLParagraphElement {
  return el("p", {}, [
    `Marked as ${type} on `,
    el("time", {
      dateTime: new Date(timestamp).toISOString(),
      textContent: `${getFormattedDate(timestamp)} at ${getFormattedTime(
        timestamp
      )}`,
    }),
  ]);
}

function createStillReadingText(
  work: HTMLElement,
  timestamp: number,
  chapter: number | undefined
): HTMLLIElement {
  return el(
    "li",
    { className: `${CLASS_PREFIX}__text-indicator--still-reading` },
    [
      el("p", {}, [
        "Still reading as of ",
        el("time", {
          dateTime: new Date(timestamp).toISOString(),
          textContent: getFormattedDate(timestamp),
        }),
        chapter
          ? ` (chapter ${chapter}/${
              getLatestChapterFromWorkListing(work) || "?"
            })`
          : "",
      ]),
    ]
  );
}

function addNotesText(work: HTMLElement, notes: string, className?: string) {
  const section = ensureChild(
    work,
    `${CLASS_PREFIX}__text-indicator__notes`,
    "blockquote"
  );
  section.appendChild(el("p", { html: notes }));
  section.setAttribute("aria-label", "User notes");
  if (className) section.classList.add(className);
}

function getStyles(prefix: string): string {
  return `
    .${prefix}__text-indicator {
      float: right;
      margin-top: 1em;
      text-align: right;
    }
    .${prefix}__text-indicator li {
      padding: 0;
      margin: 0;
    }
    .${prefix}__text-indicator li p {
      margin: 0.2em 0;
    }
    .${prefix}__text-indicator__notes {
      float: left;
      margin-top: 1em !important;
    }
  `;
}
