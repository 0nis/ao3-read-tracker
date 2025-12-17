import { el } from "./dom";
import { symbolsCache } from "../../services/cache";
import { SymbolId } from "../../enums/symbols";
import { SymbolRecord } from "../../types/symbols";

/** Gets a symbol element (image or text) by its ID. */
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
 * This is merely the *content* of the symbol, it still needs to be wrapped in a container.
 * The content will be aria-hidden, it is up to the caller to give it an appropriate label.
 *
 * @param symbol The symbol record to render
 * @param suffix Optional suffix to append to text symbols
 * @returns The rendered symbol element
 */
export function renderSymbolContent(
  symbol: SymbolRecord,
  suffix?: string
): HTMLElement {
  if (symbol.imgBlob) {
    const img = el("img", {
      src: URL.createObjectURL(symbol.imgBlob),
      alt: symbol.label,
      attrs: { "aria-hidden": "true", role: "img" },
    });
    if (suffix)
      return el("span", { attrs: { "aria-hidden": "true", role: "img" } }, [
        img,
        el("span", { textContent: suffix }),
      ]);
    return img;
  }

  return el("span", {
    textContent: (symbol.emoji || symbol.label) + (suffix ?? ""),
    attrs: { "aria-hidden": "true", role: "img" },
  });
}
