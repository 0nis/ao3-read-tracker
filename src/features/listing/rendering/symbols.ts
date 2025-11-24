import { CLASS_PREFIX } from "../../../constants/classes";
import { WorkState } from "../../../enums/works";
import { IgnoredWork, ReadWork } from "../../../types/works";
import { getLatestChapterFromWorkListing } from "../../../utils/ao3";
import {
  el,
  ensureChild,
  getElement,
  injectStyles,
} from "../../../utils/ui/dom";

/**
 * Adds symbols to a work element showing information like read/ignored status, reread worthiness, and read count.
 * @param work The work to modify
 * @param type What type of information the text is for, like a work marked as read or ignored
 * @param item The item data containing optional additional information
 */
export function addSymbols(
  work: HTMLElement,
  type: WorkState,
  item: ReadWork | IgnoredWork
) {
  injectStyles(
    `${CLASS_PREFIX}__styles--listing-symbols`,
    getStyles(CLASS_PREFIX)
  );

  const symbolIndicatorList = ensureChild(
    work.querySelector(".header.module")!,
    `${CLASS_PREFIX}__symbol-indicator`,
    "ul"
  );

  if (type === WorkState.READ)
    renderReadSymbol(work, symbolIndicatorList, item as ReadWork);
  else renderIgnoredSymbol(symbolIndicatorList, item as IgnoredWork);
}

/**
 * Removes any symbols added by this module from a work element.
 * @param work The work to modify
 */
export function removeSymbols(work: HTMLElement) {
  const elementsToRemove = [
    getElement(work, `.${CLASS_PREFIX}__symbol-indicator`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

function renderReadSymbol(
  work: HTMLElement,
  indicatorList: HTMLElement,
  item: ReadWork
) {
  if (item.isReading) {
    addListItemToIndicator(indicatorList, "📖", "Still reading");
  } else addListItemToIndicator(indicatorList, "✅", "Marked as read");

  if (item.rereadWorthy) {
    addListItemToIndicator(indicatorList, "🔁", "Marked as re-read worthy");
  }

  if (item.count) {
    addListItemToIndicator(
      indicatorList,
      `📚x${item.count}`,
      `Read ${item.count} ${item.count === 1 ? "time" : "times"}`
    );
  }

  if (
    item.isReading &&
    item.lastReadChapter &&
    item.lastReadChapter < (getLatestChapterFromWorkListing(work) || 0)
  ) {
    addListItemToIndicator(
      indicatorList,
      "‼️",
      `New chapters available! (last read: chapter ${item.lastReadChapter})`
    );
  }
}

function renderIgnoredSymbol(indicatorList: HTMLElement, item: IgnoredWork) {
  addListItemToIndicator(indicatorList, "🚫", "Marked as ignored");
}

function addListItemToIndicator(
  indicatorList: HTMLElement,
  text: string,
  label: string
) {
  const listItem = el(
    "li",
    {
      attrs: {
        "aria-label": label,
        title: label,
      },
    },
    [
      el("span", {
        textContent: text,
        attrs: { "aria-hidden": "true", role: "img" },
      }),
    ]
  );
  indicatorList.appendChild(listItem);
}

function getStyles(prefix: string): string {
  return `
    .${prefix}__symbol-indicator {
      display: inline !important;
      margin: 0 !important;
      float: right;
      position: absolute;
      top: 20px;
      right: 0px;
    }
  `;
}
