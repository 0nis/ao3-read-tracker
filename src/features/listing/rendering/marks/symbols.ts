import { ApplyMarksParams } from "../apply";
import { getLatestChapterFromWorkListing, getElement } from "../../helpers";

import { symbolsCache } from "../../../../services/cache";
import { symbolRuleCollector } from "../../../../services/rules";
import { el, ensureChild, injectStyles } from "../../../../utils/dom";
import { renderSymbolContent } from "../../../../ui/components/symbols";
import { SymbolRecord } from "../../../../types/symbols";
import { CLASS_PREFIX } from "../../../../constants/classes";
import type { DEFAULT_SYMBOL_RECORDS } from "../../../../constants/symbols";

/**
 * Adds symbols to a work element showing information
 * like finished/ignored/in-progress status, reread worthiness, and read count.
 *
 * Symbols are modified in {@link symbolRuleCollector} and {@link DEFAULT_SYMBOL_RECORDS}
 */
export async function addSymbols(params: ApplyMarksParams) {
  if (
    !params.states.finishedWork &&
    !params.states.inProgressWork &&
    !params.states.ignoredWork
  )
    return;

  injectStyles(
    `${CLASS_PREFIX}__styles--listing-symbols`,
    getStyles(CLASS_PREFIX),
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

/** Removes any symbols added by this module from a work element. */
export function removeSymbols(element: HTMLElement) {
  const elementsToRemove = [
    getElement(element, `.${CLASS_PREFIX}__symbol-indicator`),
  ].filter((el): el is HTMLElement => el !== null);
  elementsToRemove.forEach((el) => el.remove());
}

async function renderSymbols(
  { element, states, modules, settings }: ApplyMarksParams,
  symbolIndicatorList: HTMLElement,
) {
  const symbols = await symbolsCache.get();

  const rules = symbolRuleCollector.getActiveRules({
    symbols,
    states,
    modules,
    details: {
      latestChapter: getLatestChapterFromWorkListing(element) || undefined,
    },
    displayMode: {
      finished: settings.finishedSettings.symbolDisplayMode,
      inProgress: settings.inProgressSettings.symbolDisplayMode,
    },
    options: {
      enabled: settings.symbolSettings.enabled,
    },
  });

  for (const rule of rules) {
    const symbol = symbols[rule.id];
    if (!symbol) continue;

    symbolIndicatorList.appendChild(
      await createSymbolElement(
        symbol,
        rule.getCustomLabel?.() || symbols[rule.id].label,
        rule.getSuffix?.(),
      ),
    );
  }
}

async function createSymbolElement(
  symbol: SymbolRecord,
  customLabel?: string,
  suffix?: string,
): Promise<HTMLElement> {
  const content = await renderSymbolContent({ symbol, suffix });
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
    [content],
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
