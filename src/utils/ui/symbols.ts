import { SymbolId, SymbolType } from "@enums";
import { symbolsCache } from "@services/cache";
import { SymbolRecord } from "@types";

import { el } from "./dom";

/**
 * Gets a symbol element (image or text) by its ID.
 */
export async function getSymbolElement(
  id: SymbolId,
  fallback: string = "❔"
): Promise<HTMLElement> {
  const symbols = await symbolsCache.get();
  const symbol = symbols[id];
  return symbol
    ? renderSymbolContent(symbol)
    : el("span", { textContent: fallback });
}

/**
 * Renders the content for a symbol, either as an image or text.
 * @param symbol The symbol record to render
 * @param suffix Optional suffix to append to text symbols
 * @returns The rendered symbol element
 */
export function renderSymbolContent(
  symbol: SymbolRecord,
  suffix?: string
): HTMLElement {
  if (symbol.type === SymbolType.IMAGE && symbol.imgUrl) {
    const children = suffix
      ? [
          el("img", { attrs: { src: symbol.imgUrl, "aria-hidden": "true" } }),
          el("span", { textContent: suffix }),
        ]
      : [el("img", { attrs: { src: symbol.imgUrl, "aria-hidden": "true" } })];

    return el("div", {}, children);
  }

  return el("span", {
    textContent: (symbol.text || symbol.label) + (suffix ?? ""),
    attrs: { "aria-hidden": "true", role: "img" },
  });
}
