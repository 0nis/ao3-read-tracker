import { PREFIX } from "../..";
import { el } from "../../../../utils/ui/dom";
import { IgnoredWork, ReadWork } from "../../../../types/works";
import { SymbolData } from "../../../../types/symbols";
import { SymbolRule } from "../../../../services/rules/symbols";
import { getFormattedDate } from "../../../../utils/date";
import { createSymbolElement } from "./symbols";

export interface SupplementaryRowInformation {
  symbols?: {
    symbolData?: SymbolData;
    rules?: SymbolRule[];
    exclude?: string[];
  };
  text?: string;
}

export interface InnerElementParams extends SupplementaryRowInformation {
  item: ReadWork | IgnoredWork;
}

export async function createInnerElement({
  item,
  symbols,
  text,
}: InnerElementParams): Promise<HTMLElement> {
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
    el(
      "span",
      { className: `${PREFIX}__list__row__date` },
      getFormattedDate(item.modifiedAt)
    ),
    el("div", { className: `${PREFIX}__list__row__main` }, mainEls),
  ]);
}
