import { CLASS_PREFIX } from "../../../constants/classes";
import { SymbolId, SymbolType } from "../../../enums/symbols";
import { WorkState } from "../../../enums/works";
import { symbolsCache } from "../../../services/cache/symbols";
import { SymbolData, SymbolRecord } from "../../../types/symbols";
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
export async function addSymbols(
  work: HTMLElement,
  type: WorkState,
  item: ReadWork | IgnoredWork
) {
  const symbols = await symbolsCache.get();

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
    renderReadSymbol({
      symbols,
      work,
      indicatorList: symbolIndicatorList,
      item: item as ReadWork,
    });
  else
    renderIgnoredSymbol({
      symbols,
      work,
      indicatorList: symbolIndicatorList,
      item: item as IgnoredWork,
    });
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

interface RenderParams {
  symbols: SymbolData;
  work: HTMLElement;
  indicatorList: HTMLElement;
}

function renderReadSymbol({
  symbols,
  work,
  indicatorList,
  item,
}: RenderParams & { item: ReadWork }) {
  if (item.isReading) {
    indicatorList.appendChild(createSymbolElement(symbols[SymbolId.READING]));
  } else {
    indicatorList.appendChild(createSymbolElement(symbols[SymbolId.READ]));
  }

  if (item.rereadWorthy) {
    indicatorList.appendChild(
      createSymbolElement(symbols[SymbolId.REREAD_WORTHY])
    );
  }

  if (item.count) {
    indicatorList.appendChild(
      createSymbolElement(
        symbols[SymbolId.READ_COUNT],
        `Read ${item.count} ${item.count === 1 ? "time" : "times"}`,
        `x${item.count}`
      )
    );
  }

  if (
    item.isReading &&
    item.lastReadChapter &&
    item.lastReadChapter < (getLatestChapterFromWorkListing(work) || 0)
  ) {
    indicatorList.appendChild(
      createSymbolElement(
        symbols[SymbolId.NEW_CHAPTERS_AVAILABLE],
        `New chapters available! (last read: chapter ${item.lastReadChapter})`
      )
    );
  }
}

function renderIgnoredSymbol({
  symbols,
  indicatorList,
}: RenderParams & { item: IgnoredWork }) {
  indicatorList.appendChild(createSymbolElement(symbols[SymbolId.IGNORED]));
}

function createSymbolElement(
  symbol: SymbolRecord,
  customLabel?: string,
  suffix?: string
): HTMLElement {
  const label = customLabel || symbol.label;

  let contentEl: HTMLElement;

  if (symbol.type === SymbolType.IMAGE && symbol.imgUrl) {
    const children = suffix
      ? [
          el("img", { attrs: { src: symbol.imgUrl, "aria-hidden": "true" } }),
          el("span", { textContent: suffix }),
        ]
      : [el("img", { attrs: { src: symbol.imgUrl, "aria-hidden": "true" } })];

    contentEl = el("div", {}, children);
  } else {
    contentEl = el("span", {
      textContent: (symbol.text || label) + (suffix ?? ""),
      attrs: { "aria-hidden": "true", role: "img" },
    });
  }

  return el(
    "li",
    {
      attrs: { "aria-label": label, title: label },
    },
    [contentEl]
  );
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
