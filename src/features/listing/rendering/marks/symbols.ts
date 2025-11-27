import { CLASS_PREFIX } from "@constants";
import { SymbolRecord, IgnoredWork, ReadWork } from "@types";
import { symbolsCache } from "@services/cache";
import { getActiveSymbolRules } from "@services/rules";
import { getLatestChapterFromWorkListing } from "@utils/ao3";
import {
  el,
  ensureChild,
  getElement,
  injectStyles,
  renderSymbolContent,
} from "@utils/ui";

import { ApplyMarksParams } from "..";

/**
 * Adds symbols to a work element showing information like read/ignored status, reread worthiness, and read count.
 * @param work The work to modify
 * @param type What type of information the text is for, like a work marked as read or ignored
 * @param item The item data containing optional additional information
 */
export async function addSymbols({
  item,
  readWork,
  ignoredWork,
}: ApplyMarksParams) {
  if (!readWork && !ignoredWork) return;

  injectStyles(
    `${CLASS_PREFIX}__styles--listing-symbols`,
    getStyles(CLASS_PREFIX)
  );

  const symbolIndicatorList = ensureChild(
    item.querySelector(".header.module")!,
    `${CLASS_PREFIX}__symbol-indicator`,
    "ul",
    {
      tabIndex: 0,
      attrs: {
        "aria-label": "Work status indicators",
      },
    }
  );

  await renderSymbols(item, symbolIndicatorList, readWork, ignoredWork);
}

/**
 * Removes any symbols added by this module from a work element.
 * @param item The work to modify
 */
export function removeSymbols(item: HTMLElement) {
  const elementsToRemove = [
    getElement(item, `.${CLASS_PREFIX}__symbol-indicator`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

async function renderSymbols(
  item: HTMLElement,
  symbolIndicatorList: HTMLElement,
  readWork: ReadWork | undefined,
  ignoredWork: IgnoredWork | undefined
) {
  const symbols = await symbolsCache.get();

  const rules = getActiveSymbolRules({
    read: readWork,
    ignored: ignoredWork,
    details: {
      latestChapter: getLatestChapterFromWorkListing(item) || undefined,
    },
  });

  for (const rule of rules) {
    const symbol = symbols[rule.id];
    if (!symbol) continue;

    symbolIndicatorList.appendChild(
      createSymbolElement(
        symbol,
        rule.getCustomLabel?.() || symbols[rule.id].label,
        rule.getSuffix?.()
      )
    );
  }
}

function createSymbolElement(
  symbol: SymbolRecord,
  customLabel?: string,
  suffix?: string
): HTMLElement {
  const content = renderSymbolContent(symbol, suffix);
  const label = customLabel || symbol.label;

  return el(
    "li",
    {
      className: `${CLASS_PREFIX}__symbol-indicator__item`,
      // Making these tabbable is not best practice, but it allows keyboard users to discover the symbols more easily.
      // And work listings are already quite heavy on tab stops anyway.
      tabIndex: 0,
      attrs: {
        "aria-label": label,
        title: label,
      },
    },
    [content]
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

    .${prefix}__symbol-indicator__item {
      cursor: default;
    }
      
    .${prefix}__symbol-indicator:focus,
    .${prefix}__symbol-indicator__item:focus {
      outline: 1px dotted;
    }
  `;
}
