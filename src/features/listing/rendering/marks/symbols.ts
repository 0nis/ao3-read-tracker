import { ApplyMarksParams } from "../apply";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { symbolsCache } from "../../../../services/cache/symbols";
import { getActiveSymbolRules } from "../../../../services/rules/symbols";
import { SymbolRecord } from "../../../../types/symbols";
import { getLatestChapterFromWorkListing } from "../../../../utils/ao3";
import {
  el,
  ensureChild,
  getElement,
  injectStyles,
} from "../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../utils/ui/symbols";

/**
 * Adds symbols to a work element showing information
 * like read/ignored status, reread worthiness, and read count.
 */
export async function addSymbols(params: ApplyMarksParams) {
  if (!params.readWork && !params.inProgressWork && !params.ignoredWork) return;

  injectStyles(
    `${CLASS_PREFIX}__styles--listing-symbols`,
    getStyles(CLASS_PREFIX)
  );

  const symbolIndicatorList = ensureChild({
    parent: params.element.querySelector(".header.module")!,
    className: `${CLASS_PREFIX}__symbol-indicator`,
    tag: "ul",
    createProps: {
      tabIndex: 0,
      attrs: {
        "aria-label": "Work status indicators",
      },
    },
  });

  await renderSymbols(params, symbolIndicatorList);
}

/**
 * Removes any symbols added by this module from a work element.
 * @param element The work to modify
 */
export function removeSymbols(element: HTMLElement) {
  const elementsToRemove = [
    getElement(element, `.${CLASS_PREFIX}__symbol-indicator`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

async function renderSymbols(
  {
    element,
    readWork,
    inProgressWork,
    ignoredWork,
    settings,
  }: ApplyMarksParams,
  symbolIndicatorList: HTMLElement
) {
  const symbols = await symbolsCache.get();

  const rules = getActiveSymbolRules({
    readWork: readWork,
    inProgressWork: inProgressWork,
    ignoredWork: ignoredWork,
    details: {
      latestChapter: getLatestChapterFromWorkListing(element) || undefined,
    },
    displayMode: settings.generalSettings.symbolDisplayMode,
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
