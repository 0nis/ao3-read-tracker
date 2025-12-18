import { el } from "./dom";
import { symbolsCache } from "../../services/cache";
import { SymbolId } from "../../enums/symbols";
import { CLASS_PREFIX } from "../../constants/classes";
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
 * The content will have role presentation, it is up to the caller to give it an appropriate label in the wrapper.
 *
 * @param symbol The symbol record to render
 * @param suffix Optional suffix to append to text symbols
 * @returns The rendered symbol element
 */
export function renderSymbolContent(
  symbol: SymbolRecord,
  suffix?: string
): HTMLElement {
  const children: HTMLElement[] = [];

  if (symbol.imgBlob) {
    const url = URL.createObjectURL(symbol.imgBlob);
    children.push(
      el("img", {
        src: url,
        alt: symbol.label,
        className: `${CLASS_PREFIX}__inline-image`,
        onload: () => URL.revokeObjectURL(url), // Cleanup
        onerror: () => URL.revokeObjectURL(url), // Cleanup
      })
    );
  } else {
    children.push(el("span", { textContent: symbol.emoji || symbol.label }));
  }

  if (suffix)
    children.push(
      el("span", {
        className: `${CLASS_PREFIX}__suffix`,
        textContent: suffix,
      })
    );

  return el("span", { attrs: { role: "presentation" } }, children);
}
