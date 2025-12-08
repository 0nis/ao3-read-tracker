import { LIST_CLASS } from "../base/list.old";
import { settingsCache, symbolsCache } from "../../../../services/cache";
import { getActiveSymbolRules, SymbolRule } from "../../../../services/rules";
import { StorageService } from "../../../../services/storage";
import { el } from "../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../utils/ui/symbols";
import { SymbolData } from "../../../../types/symbols";
import { WorkStateData } from "../../../../types/works";

export async function loadSymbolsAndRules(
  id: string,
  { finishedWork, inProgressWork, ignoredWork }: WorkStateData
) {
  const symbols = await symbolsCache.get();
  const { finishedSettings, inProgressSettings } = await settingsCache.get();

  const rules = getActiveSymbolRules({
    finishedWork:
      finishedWork ?? (await StorageService.finishedWorks.getById(id))?.data,
    inProgressWork:
      inProgressWork ??
      (await StorageService.inProgressWorks.getById(id))?.data,
    ignoredWork:
      ignoredWork ?? (await StorageService.ignoredWorks.getById(id))?.data,
    displayMode: {
      finished: finishedSettings.symbolDisplayMode,
      inProgress: inProgressSettings.symbolDisplayMode,
    },
    options: { showState: true, showStatus: true },
  });

  return { symbols, rules };
}

export async function createSymbolElement(
  symbols: SymbolData,
  rules: SymbolRule[]
): Promise<HTMLElement> {
  const symbolWrapper = el(
    "ul",
    { className: `${LIST_CLASS}__row-main--info--symbols` },
    []
  );

  for (const rule of rules) {
    const symbol = symbols[rule.id];
    if (!symbol) continue;

    const label = rule.getCustomLabel?.() || symbol.label;
    symbolWrapper.appendChild(
      el(
        "li",
        {
          className: `${LIST_CLASS}__row-main--info--symbols__item`,
          attrs: {
            "aria-label": label,
            title: label,
          },
        },
        [renderSymbolContent(symbol, rule.getSuffix?.())]
      )
    );
  }

  return symbolWrapper;
}
