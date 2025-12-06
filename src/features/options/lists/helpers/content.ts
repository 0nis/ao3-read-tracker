import { PREFIX } from "../..";
import { createSymbolElement } from "./symbols";

import { SymbolRule } from "../../../../services/rules";
import { el } from "../../../../utils/ui/dom";
import { IgnoredWork, ReadWork, WorkStateData } from "../../../../types/works";
import { SymbolData } from "../../../../types/symbols";

export interface SupplementaryRowInformation {
  date: string;
  symbols?: {
    symbolData?: SymbolData;
    rules?: SymbolRule[];
    exclude?: string[];
  };
  text?: string;
}

export interface InnerElementParams extends SupplementaryRowInformation {
  item: WorkStateData[keyof WorkStateData];
}

export async function createInnerElement({
  item,
  symbols,
  text,
  date,
}: InnerElementParams): Promise<HTMLElement> {
  if (!item)
    return el("div", { className: `${PREFIX}__list__row__content` }, [
      "Item not found",
    ]);
  const mainEls: HTMLElement[] = [];

  // Title
  mainEls.push(
    el(
      "p",
      { className: `${PREFIX}__list__row__title` },
      item.title || "untitled"
    )
  );

  // Reason, note, etc.
  if (text) {
    mainEls.push(el("p", { className: `${PREFIX}__list__row__text` }, text));
  }

  // Symbols
  if (symbols?.symbolData && symbols?.rules) {
    const filteredRules = symbols.rules.filter(
      (rule) => !symbols.exclude?.includes(rule.id)
    );
    const symbolsElement = await createSymbolElement(
      symbols.symbolData,
      filteredRules
    );
    mainEls.push(symbolsElement);
  }

  return el("div", { className: `${PREFIX}__list__row__content` }, [
    el("span", { className: `${PREFIX}__list__row__date` }, date),
    el("div", { className: `${PREFIX}__list__row__main` }, mainEls),
  ]);
}
