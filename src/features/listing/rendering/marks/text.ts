import { ApplyMarksParams } from "../apply";

import {
  textIndicatorRuleCollector,
  workNotesRuleCollector,
} from "../../../../services/rules";
import { getLatestChapterFromWorkListing } from "../../../../utils/ao3";
import {
  getFormattedDateAsFullText,
  getFormattedTime,
  timestampToISOString,
} from "../../../../utils/date";
import {
  el,
  ensureChild,
  getElement,
  injectStyles,
} from "../../../../utils/ui/dom";
import { replacePlaceholders } from "../../../../utils/string";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { WorkState } from "../../../../enums/works";

/**
 * Adds text to a work element within a listing, showing when
 * it was marked as read/ignored/in-progress, along with any notes.
 *
 * Text is modified in {@link collectTextIndicatorRules} and {@link collectNotesTextRules}
 */
export function addText(params: ApplyMarksParams) {
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-text`,
    getStyles(CLASS_PREFIX)
  );

  const indicatorList = ensureChild({
    parent: params.element,
    className: `${CLASS_PREFIX}__text-indicator`,
    tag: "ul",
  });

  createIndicators({ ...params }, indicatorList);
  createNotes(params);
}

/** Removes any text added by this module from a work element. */
export function removeText(element: HTMLElement) {
  const elementsToRemove = [
    getElement(element, `.${CLASS_PREFIX}__text-indicator`),
    getElement(element, `.${CLASS_PREFIX}__text-indicator__notes`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

/** Edit indicators in {@link collectTextIndicatorRules} */
function createIndicators(
  params: ApplyMarksParams,
  indicatorList: HTMLElement
) {
  for (const rule of textIndicatorRuleCollector.getActiveRules(params)) {
    indicatorList.appendChild(
      addIndicatorText(
        rule.workState,
        rule.getTimeStamp(),
        rule.getText(),
        params.element
      )
    );
  }
}

/** Edit notes in {@link collectNotesTextRules} */
function createNotes(params: ApplyMarksParams) {
  for (const rule of workNotesRuleCollector.getActiveRules(params)) {
    addNotesText(params.element, rule.getText(), rule.className);
  }
}

function addIndicatorText(
  type: WorkState,
  timestamp: number | undefined,
  text: string,
  element: HTMLElement
): HTMLElement {
  const replace = (str: string) => {
    return replacePlaceholders(str, {
      type: type,
      latest_chapter:
        getLatestChapterFromWorkListing(element)?.toString() || "?",
    });
  };

  const [before, after] = text.split("%date%");
  const nodes: (string | HTMLElement)[] = [];

  if (before) nodes.push(replace(before));
  nodes.push(createTimestampElement(timestamp));
  if (after) nodes.push(replace(after));

  return el(
    "li",
    {
      className: `${CLASS_PREFIX}__text-indicator--${type}`,
    },
    [el("p", {}, nodes)]
  );
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

function createTimestampElement(
  timestamp: number | undefined
): HTMLElement | string {
  return el("time", {
    dateTime: timestampToISOString(timestamp),
    textContent: `${getFormattedDateAsFullText(
      timestamp,
      "short"
    )} at ${getFormattedTime(timestamp)}`,
  });
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
