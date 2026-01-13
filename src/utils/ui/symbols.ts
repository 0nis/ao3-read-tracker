import { el } from "./dom";
import { settingsCache, symbolsCache } from "../../services/cache";
import {
  SymbolId,
  SymbolFallbackType,
  SymbolRenderMode,
} from "../../enums/symbols";
import { CLASS_PREFIX } from "../../constants/classes";
import { EMOJI_SCALE } from "../../constants/global";
import { SymbolRecord } from "../../types/symbols";

/** Gets a symbol element (image or text) by its ID. */
export async function renderSymbolContentById(
  id: SymbolId,
  fallback?: string
): Promise<HTMLElement> {
  const symbols = await symbolsCache.get();
  const { symbolSettings } = await settingsCache.get();

  const symbol = symbols[id];

  if (symbol)
    return await renderSymbolContent({
      symbol,
    });
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
export async function renderSymbolContent({
  symbol,
  suffix,
}: {
  symbol: SymbolRecord;
  suffix?: string;
}): Promise<HTMLElement> {
  const {
    renderMode = SymbolRenderMode.AUTO,
    fallbackType = SymbolFallbackType.LABEL,
    size = 1.2,
  } = (await settingsCache.get()).symbolSettings || {};

  const rm =
    renderMode === SymbolRenderMode.AUTO
      ? determineRenderMode(symbol)
      : renderMode;

  if (rm === SymbolRenderMode.IMAGE) {
    const img = renderSymbolImgBlob(symbol, size);
    if (img) return buildSymbolContent(img, suffix);
    else return renderSymbolFallback(fallbackType, symbol.label);
  }

  if (rm === SymbolRenderMode.EMOJI) {
    const emoji = renderSymbolEmoji(symbol, size);
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

const renderSymbolImgBlob = (
  symbol: SymbolRecord,
  size: number
): HTMLImageElement | null => {
  if (!symbol.imgBlob) return null;
  const url = URL.createObjectURL(symbol.imgBlob);
  const img = el("img", {
    src: url,
    alt: symbol.label,
    className: `${CLASS_PREFIX}__inline-image`,
    style: { height: `${size}em` },
    onload: () => URL.revokeObjectURL(url), // Cleanup
    onerror: () => URL.revokeObjectURL(url), // Cleanup
  });
  return img;
};

const renderSymbolEmoji = (
  symbol: SymbolRecord,
  size: number
): HTMLElement | null => {
  if (!symbol.emoji) return null;
  return el("span", {
    textContent: symbol.emoji,
    style: { fontSize: `${size * EMOJI_SCALE}em` },
  });
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
