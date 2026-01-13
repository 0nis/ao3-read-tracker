import { el } from "./dom";
import { settingsCache, symbolsCache } from "../../services/cache";
import {
  SymbolId,
  SymbolFallbackType,
  SymbolRenderMode,
} from "../../enums/symbols";
import { CLASS_PREFIX } from "../../constants/classes";
import { SymbolRecord } from "../../types/symbols";
import { SymbolSettings } from "../../types/settings";

/** Gets a symbol element (image or text) by its ID. */
export async function getSymbolElement(
  id: SymbolId,
  fallback?: string
): Promise<HTMLElement> {
  const symbols = await symbolsCache.get();
  const { symbolSettings } = await settingsCache.get();

  const symbol = symbols[id];

  if (symbol) return renderSymbolContent(symbol);
  else {
    if (fallback)
      return renderSymbolFallback(SymbolFallbackType.LABEL, fallback);
    else return renderSymbolFallback(symbolSettings.fallbackType);
  }
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
  suffix?: string,
  settings?: SymbolSettings
): HTMLElement {
  const {
    renderMode = SymbolRenderMode.AUTO,
    fallbackType = SymbolFallbackType.LABEL,
  } = settings || {};

  const rm =
    renderMode === SymbolRenderMode.AUTO
      ? determineRenderMode(symbol)
      : renderMode;

  if (rm === SymbolRenderMode.IMAGE) {
    const img = renderSymbolImgBlob(symbol);
    if (img) return buildSymbolContent(img, suffix);
    else return renderSymbolFallback(fallbackType, symbol.label);
  }

  if (rm === SymbolRenderMode.EMOJI) {
    const emoji = renderSymbolEmoji(symbol);
    if (emoji) return buildSymbolContent(emoji, suffix);
    else return renderSymbolFallback(fallbackType, symbol.label);
  }

  return renderSymbolFallback(fallbackType, symbol.label);
}

const determineRenderMode = (symbol: SymbolRecord): SymbolRenderMode | null => {
  if (symbol.imgBlob) return SymbolRenderMode.IMAGE;
  if (symbol.emoji) return SymbolRenderMode.EMOJI;
  return null;
};

const buildSymbolContent = (
  symbolEl: HTMLElement,
  suffix?: string
): HTMLElement => {
  return el("span", { attrs: { role: "presentation" } }, [
    symbolEl,
    ...(suffix
      ? [
          el("span", {
            className: `${CLASS_PREFIX}__suffix`,
            textContent: suffix,
          }),
        ]
      : []),
  ]);
};

const renderSymbolImgBlob = (symbol: SymbolRecord): HTMLImageElement | null => {
  if (!symbol.imgBlob) return null;
  const url = URL.createObjectURL(symbol.imgBlob);
  return el("img", {
    src: url,
    alt: symbol.label,
    className: `${CLASS_PREFIX}__inline-image`,
    onload: () => URL.revokeObjectURL(url), // Cleanup
    onerror: () => URL.revokeObjectURL(url), // Cleanup
  });
};

const renderSymbolEmoji = (symbol: SymbolRecord): HTMLElement | null => {
  if (!symbol.emoji) return null;
  return el("span", { textContent: symbol.emoji });
};

const renderSymbolFallback = (
  fallback: SymbolFallbackType,
  label?: string,
  suffix?: string
): HTMLElement => {
  switch (fallback) {
    case SymbolFallbackType.LABEL:
      return buildSymbolContent(
        el("span", { textContent: label || "404" }),
        suffix
      );
    case SymbolFallbackType.QUESTION_MARK:
      return buildSymbolContent(el("span", { textContent: "❔" }), suffix);
    case SymbolFallbackType.HIDDEN:
      return buildSymbolContent(el("span", { textContent: "" }));
  }
};
