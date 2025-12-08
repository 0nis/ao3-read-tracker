import { createSymbolElement } from "./symbols";
import { LIST_CLASS } from "../../base/list.old";

import { SymbolRule } from "../../../../../services/rules";
import { el } from "../../../../../utils/ui/dom";
import { WorkStateData } from "../../../../../types/works";
import { SymbolData } from "../../../../../types/symbols";

export interface SupplementaryRowInformation {
  date: string;
  symbols?: {
    symbolData?: SymbolData;
    rules?: SymbolRule[];
    exclude?: string[];
  };
  text?: string;
  status?: string;
}

export interface InnerElementParams extends SupplementaryRowInformation {
  item: WorkStateData[keyof WorkStateData];
}

export async function createInnerElement({
  item,
  symbols,
  text,
  date,
  status,
}: InnerElementParams): Promise<HTMLElement> {
  if (!item)
    return el("div", { className: `${LIST_CLASS}__row-content` }, [
      "Item not found",
    ]);
  const mainEls: HTMLElement[] = [];
  const infoEls: HTMLElement[] = [];

  // Title
  mainEls.push(
    el("p", { className: `${LIST_CLASS}__row-title` }, item.title || "untitled")
  );

  // Reason, note, etc.
  if (text) {
    mainEls.push(el("p", { className: `${LIST_CLASS}__row-main--text` }, text));
  }

  // TODO: Make configurable whether they show up or not. Just use local storage for that
  // Symbols
  if (symbols?.symbolData && symbols?.rules) {
    const filteredRules = symbols.rules.filter(
      (rule) => !symbols.exclude?.includes(rule.id)
    );
    const symbolsElement = await createSymbolElement(
      symbols.symbolData,
      filteredRules
    );
    infoEls.push(symbolsElement);
  }

  // TODO: Make configurable whether this shows up or not. Again just use local storage
  // Status
  if (status) {
    status = status.charAt(0).toUpperCase() + status.slice(1);
    infoEls.push(
      el("p", { className: `${LIST_CLASS}__row-main--info--status` }, status)
    );
  }

  if (infoEls.length > 0) {
    mainEls.push(
      el("div", { className: `${LIST_CLASS}__row-main--info` }, infoEls)
    );
  }

  return el("div", { className: `${LIST_CLASS}__row-content` }, [
    el("span", { className: `${LIST_CLASS}__row-date` }, date),
    el("div", { className: `${LIST_CLASS}__row-main` }, mainEls),
  ]);
}
