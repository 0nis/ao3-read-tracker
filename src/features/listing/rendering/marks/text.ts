import { CLASS_PREFIX } from "@constants";
import { WorkState } from "@enums";
import type { ReadWork, IgnoredWork } from "@types";
import { getLatestChapterFromWorkListing } from "@utils/ao3";
import { getFormattedDate, getFormattedTime } from "@utils/date";
import { el, ensureChild, getElement, injectStyles } from "@utils/ui";

import { ApplyMarksParams } from "..";

/**
 * Adds text to a work element showing that it was marked as read/ignored, and any additional information.
 * @param work The work to modify
 * @param readWork The read work data, if any
 * @param ignoredWork The ignored work data, if any
 */
export function addText({ item, readWork, ignoredWork }: ApplyMarksParams) {
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-text`,
    getStyles(CLASS_PREFIX)
  );

  const indicatorList = ensureChild(
    item,
    `${CLASS_PREFIX}__text-indicator`,
    "ul"
  );

  if (readWork) renderReadInformation(item, indicatorList, readWork);
  if (ignoredWork) renderIgnoredInformation(item, indicatorList, ignoredWork);
}

/**
 * Removes any text added by this module from a work element.
 * @param item The work to modify
 */
export function removeText(item: HTMLElement) {
  const elementsToRemove = [
    getElement(item, `.${CLASS_PREFIX}__text-indicator`),
    getElement(item, `.${CLASS_PREFIX}__text-indicator__notes`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

function renderReadInformation(
  item: HTMLElement,
  indicatorList: HTMLElement,
  readWork: ReadWork
) {
  if (readWork.notes)
    addNotesText(item, readWork.notes, `${CLASS_PREFIX}__notes--read`);
  if (readWork.isReading) {
    indicatorList.appendChild(
      createStillReadingText(
        item,
        readWork.modifiedAt,
        readWork.lastReadChapter
      )
    );
  } else {
    indicatorList.appendChild(
      createIndicator(WorkState.READ, readWork.modifiedAt)
    );
  }
}

function renderIgnoredInformation(
  item: HTMLElement,
  indicatorList: HTMLElement,
  ignoredWork: IgnoredWork
) {
  indicatorList.appendChild(
    createIndicator(WorkState.IGNORED, ignoredWork.modifiedAt)
  );
  if (ignoredWork.reason)
    addNotesText(item, ignoredWork.reason, `${CLASS_PREFIX}__notes--ignored`);
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
  item: HTMLElement,
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
              getLatestChapterFromWorkListing(item) || "?"
            })`
          : "",
      ]),
    ]
  );
}

function addNotesText(item: HTMLElement, notes: string, className?: string) {
  const section = ensureChild(
    item,
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
