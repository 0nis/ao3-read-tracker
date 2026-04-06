import { createSymbolElement } from "./symbols";
import { ListRowTypeMap } from "../../config";
import { SupplementaryRowInformation } from "../../types";
import { getListClass } from "../../components/list";

import { el } from "../../../../../../utils/ui/dom";

export interface InnerElementParams extends SupplementaryRowInformation {
  item: ListRowTypeMap[keyof ListRowTypeMap];
}

export async function createInnerElement({
  item,
  symbols,
  text,
  date,
  status,
}: InnerElementParams): Promise<HTMLElement> {
  if (!item)
    return el("div", { className: `${getListClass()}__row-content` }, [
      "Item not found",
    ]);
  const mainEls: HTMLElement[] = [];
  const infoEls: HTMLElement[] = [];

  // Title
  mainEls.push(
    el(
      "p",
      { className: `${getListClass()}__row-main--title` },
      item.title || "untitled",
    ),
  );

  // Reason, note, etc.
  if (text) {
    mainEls.push(
      el("p", { className: `${getListClass()}__row-main--text` }, text),
    );
  }

  // Symbols
  if (symbols?.data && symbols?.rules) {
    const filteredRules = symbols.rules.filter(
      (rule) => !symbols.exclude?.includes(rule.id),
    );
    const symbolsElement = await createSymbolElement(
      symbols.data,
      filteredRules,
    );
    infoEls.push(symbolsElement);
  }

  // Status
  if (status) {
    status = status.charAt(0).toUpperCase() + status.slice(1);
    infoEls.push(
      el(
        "p",
        { className: `${getListClass()}__row-main--info--status` },
        status,
      ),
    );
  }

  if (infoEls.length > 0) {
    mainEls.push(
      el("div", { className: `${getListClass()}__row-main--info` }, infoEls),
    );
  }

  const dateParts = [
    el("span", {}, date?.year?.toString() || "----"),
    el("span", {}, "/"),
    el("span", {}, date?.month?.toString() || "--"),
    el("span", {}, "/"),
    el("span", {}, date?.day?.toString() || "--"),
  ];

  return el("div", { className: `${getListClass()}__row-content` }, [
    el("span", { className: `${getListClass()}__row-date` }, dateParts),
    el("div", { className: `${getListClass()}__row-main` }, mainEls),
  ]);
}
