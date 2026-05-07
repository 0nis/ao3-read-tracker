import { ApplyMarksParams } from "../apply";
import { getLatestChapterFromWorkListing, getElement } from "../../helpers";

import {
  textIndicatorRuleCollector,
  workNotesRuleCollector,
} from "../../../../services/rules";
import {
  getFormattedDateAsFullText,
  getFormattedTime,
  timestampToISOString,
} from "../../../../utils/date";
import { el, ensureChild, injectStyles } from "../../../../utils/dom";
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
    getStyles(CLASS_PREFIX),
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

/** Edit notes in {@link collectNotesTextRules} */
function createNotes(params: ApplyMarksParams) {
  for (const rule of workNotesRuleCollector.getActiveRules(params)) {
    addNotesText(params.element, rule.getText(), rule.className);
  }
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

/** Edit indicators in {@link collectTextIndicatorRules} */
function createIndicators(
  params: ApplyMarksParams,
  indicatorList: HTMLElement,
) {
  const { finishedWork, inProgressWork, ignoredWork } = params.states;
  for (const rule of textIndicatorRuleCollector.getActiveRules({
    ...params,
    labelSettings: params.settings.labelSettings,
  })) {
    indicatorList.appendChild(
      addIndicatorText({
        type: rule.workState,
        text: rule.getText(),
        timestamps: {
          started_at: inProgressWork?.startedAt,
          last_read_at: inProgressWork?.lastReadAt,
          ignored_at: ignoredWork?.ignoredAt,
          finished_at: finishedWork?.finishedAt,
        },
        placeholders: {
          status: rule.getStatus() || "N/A",
          notes: rule.getNotes() || "N/A",
          last_read_chapter: inProgressWork?.lastReadChapter?.toString() || "?",
          latest_chapter:
            getLatestChapterFromWorkListing(params.element)?.toString() || "?",
          reread_worthy: finishedWork
            ? finishedWork?.rereadWorthy
              ? "yes"
              : "no"
            : "N/A",
          times_read: finishedWork?.timesRead?.toString() || "0",
        },
      }),
    );
  }
}

function addIndicatorText({
  type,
  text,
  timestamps,
  placeholders,
}: {
  type: WorkState;
  text: string;
  timestamps: Record<string, number | undefined>;
  placeholders: Record<string, string>;
}): HTMLElement {
  const nodes = parseText(text, placeholders, timestamps);

  return el(
    "li",
    {
      className: `${CLASS_PREFIX}__text-indicator--${type}`,
    },
    [el("p", {}, nodes)],
  );
}

function parseText(
  text: string,
  placeholders: Record<string, string>,
  timestamps: Record<string, number | undefined>,
): (string | HTMLElement)[] {
  const parts: (string | HTMLElement)[] = [];
  const regex = /%([^%]+)%/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    const [full, key] = match;
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    const replacement = resolvePlaceholder(key, placeholders, timestamps);
    if (replacement !== undefined) parts.push(replacement);
    else parts.push(full);

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

function resolvePlaceholder(
  key: string,
  placeholders: Record<string, string>,
  timestamps: Record<string, number | undefined>,
): string | HTMLElement | undefined {
  if (key in placeholders) return placeholders[key];

  const ts = timestamps[key];
  if (ts !== undefined) return createTimestampElement(ts);

  return undefined;
}

function createTimestampElement(timestamp: number): HTMLElement | string {
  return el("time", {
    dateTime: timestampToISOString(timestamp),
    textContent: `${getFormattedDateAsFullText(
      timestamp,
      "short",
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
