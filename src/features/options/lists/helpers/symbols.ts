import { PREFIX } from "../..";
import { settingsCache, symbolsCache } from "../../../../services/cache";
import { getActiveSymbolRules, SymbolRule } from "../../../../services/rules";
import { StorageService } from "../../../../services/storage";
import { SymbolData } from "../../../../types/symbols";
import { WorkStateData } from "../../../../types/works";
import { el } from "../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../utils/ui/symbols";

export async function loadSymbolsAndRules(
  id: string,
  { readWork, inProgressWork, ignoredWork }: WorkStateData
) {
  const symbols = await symbolsCache.get();
  const { readSettings, inProgressSettings } = await settingsCache.get();

  const rules = getActiveSymbolRules({
    readWork: readWork ?? (await StorageService.readWorks.getById(id))?.data,
    inProgressWork:
      inProgressWork ??
      (await StorageService.inProgressWorks.getById(id))?.data,
    ignoredWork:
      ignoredWork ?? (await StorageService.ignoredWorks.getById(id))?.data,
    displayMode: {
      read: readSettings.symbolDisplayMode,
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
    { className: `${PREFIX}__list__row__symbols` },
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
          className: `${PREFIX}__list__row__symbols__item`,
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
