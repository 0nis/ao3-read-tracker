import { PREFIX } from "../..";
import { SymbolRule } from "../../../../services/rules/symbols";
import { SymbolData } from "../../../../types/symbols";
import { el } from "../../../../utils/ui/dom";
import { renderSymbolContent } from "../../../../utils/ui/symbols";

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
