import { ApplyMarksParams } from "../apply";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { WorkState } from "../../../../enums/works";
import type { ReadWork, IgnoredWork } from "../../../../types/works";
import { getLatestChapterFromWorkListing } from "../../../../utils/ao3";
import {
  getFormattedDate,
  getFormattedTime,
  timestampToISOString,
} from "../../../../utils/date";
import {
  el,
  ensureChild,
  getElement,
  injectStyles,
} from "../../../../utils/ui/dom";

/**
 * Adds text to a work element showing that it was marked as read/ignored, and any additional information.
 * @param work The work to modify
 * @param readWork The read work data, if any
 * @param ignoredWork The ignored work data, if any
 */
export function addText({ element, readWork, ignoredWork }: ApplyMarksParams) {
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-text`,
    getStyles(CLASS_PREFIX)
  );

  const indicatorList = ensureChild({
    parent: element,
    className: `${CLASS_PREFIX}__text-indicator`,
    tag: "ul",
  });

  if (readWork) renderReadInformation(element, indicatorList, readWork);
  if (ignoredWork)
    renderIgnoredInformation(element, indicatorList, ignoredWork);
}

/**
 * Removes any text added by this module from a work element.
 * @param element The work to modify
 */
export function removeText(element: HTMLElement) {
  const elementsToRemove = [
    getElement(element, `.${CLASS_PREFIX}__text-indicator`),
    getElement(element, `.${CLASS_PREFIX}__text-indicator__notes`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

function renderReadInformation(
  element: HTMLElement,
  indicatorList: HTMLElement,
  readWork: ReadWork
) {
  if (readWork.notes)
    addNotesText(element, readWork.notes, `${CLASS_PREFIX}__notes--read`);

  const txt = readWork.isReading
    ? `Still reading as of %date% (chapter ${readWork.lastReadChapter || "?"}/${
        getLatestChapterFromWorkListing(element) || "?"
      })`
    : "Marked as read on %date%";

  indicatorList.appendChild(
    createIndicator(WorkState.READ, readWork.modifiedAt, txt)
  );
}

function renderIgnoredInformation(
  element: HTMLElement,
  indicatorList: HTMLElement,
  ignoredWork: IgnoredWork
) {
  indicatorList.appendChild(
    createIndicator(WorkState.IGNORED, ignoredWork.modifiedAt)
  );
  if (ignoredWork.reason)
    addNotesText(
      element,
      ignoredWork.reason,
      `${CLASS_PREFIX}__notes--ignored`
    );
}

function createIndicator(
  type: WorkState,
  timestamp: number,
  text: string = "Marked as %type% on %date%"
): HTMLElement {
  return el(
    "li",
    {
      className: `${CLASS_PREFIX}__text-indicator--${type}`,
    },
    [createIndicatorText(type, text, timestamp)]
  );
}

function createIndicatorText(
  type: WorkState,
  text: string,
  timestamp: number
): HTMLParagraphElement {
  const timeEl = el("time", {
    dateTime: timestampToISOString(timestamp),
    textContent: `${getFormattedDate(timestamp)} at ${getFormattedTime(
      timestamp
    )}`,
  });

  const replaceType = (text: string, type: WorkState) =>
    text.replace("%type%", type);

  const [before, after] = text.split("%date%");
  const nodes: (string | HTMLElement)[] = [];

  if (before) nodes.push(replaceType(before, type));
  nodes.push(timeEl);
  if (after) nodes.push(replaceType(after, type));

  return el("p", {}, nodes);
}

function addNotesText(element: HTMLElement, notes: string, className?: string) {
  const section = ensureChild({
    parent: element,
    className: `${CLASS_PREFIX}__text-indicator__notes`,
    tag: "blockquote",
  });
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
