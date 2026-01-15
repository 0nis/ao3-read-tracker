import { el } from "./dom";
import { settingsCache, symbolsCache } from "../../services/cache";
import {
  SymbolId,
  SymbolFallbackType,
  SymbolRenderMode,
} from "../../enums/symbols";
import { CLASS_PREFIX } from "../../constants/classes";
import { DEFAULT_SYMBOL_SIZE_EM, EMOJI_SCALE } from "../../constants/global";
import { SymbolRecord } from "../../types/symbols";

export interface SymbolDevOptions {
  sizeOverride?: number;
  fallbackTypeOverride?: SymbolFallbackType;
  disableEmojiScaling?: boolean;
}

/**
 * Gets a symbol element by its ID by calling {@link renderSymbolContent}.
 * To be used for usecases where a specific symbol is always needed (e.g., hamburger menu icon).
 * This is merely the *content* of the symbol, it still needs to be wrapped in a container.
 * The content will have role presentation, it is up to the caller to give it an appropriate label in the wrapper.
 *
 * @param id The ID of the symbol
 * @param fallback Optional fallback text or emoji to use if the symbol is not found (overrides user-selected fallback)
 * @param sizeOverride Optional size (in em) of the symbol (overrides user-selected size)
 * @returns The rendered symbol element.
 */
export async function renderSymbolContentById(
  id: SymbolId,
  fallback?: string,
  options?: SymbolDevOptions
): Promise<HTMLElement> {
  const symbols = await symbolsCache.get();
  const { symbolSettings } = await settingsCache.get();

  const symbol = symbols[id];

  if (symbol)
    return await renderSymbolContent({
      symbol,
      ...options,
    });
  else {
    if (fallback)
      return renderSymbolFallback({
        fallbackType: SymbolFallbackType.LABEL,
        label: fallback,
      });
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
 * @param sizeOverride Optional size (in em) of the symbol (overrides user-selected size)
 * @param fallbackTypeOverride Optional fallback type (overrides user-selected fallback)
 * @returns The rendered symbol element
 */
export async function renderSymbolContent({
  symbol,
  suffix,
  sizeOverride,
  fallbackTypeOverride,
  disableEmojiScaling,
}: {
  symbol: SymbolRecord;
  suffix?: string;
} & SymbolDevOptions): Promise<HTMLElement> {
  let {
    renderMode = SymbolRenderMode.AUTO,
    fallbackType = SymbolFallbackType.LABEL,
    size = DEFAULT_SYMBOL_SIZE_EM,
  } = (await settingsCache.get()).symbolSettings || {};

  if (sizeOverride) size = sizeOverride;
  if (fallbackTypeOverride) fallbackType = fallbackTypeOverride;

  const rm =
    renderMode === SymbolRenderMode.AUTO
      ? determineRenderMode(symbol)
      : renderMode;

  if (rm === SymbolRenderMode.IMAGE) {
    const img = renderSymbolImgBlob(symbol, size);
    if (img) return buildSymbolContent(img, suffix, size);
    else return renderSymbolFallback({ fallbackType, label: symbol.label });
  }

  if (rm === SymbolRenderMode.EMOJI) {
    const emoji = renderSymbolEmoji(symbol, size, disableEmojiScaling);
    if (emoji) return buildSymbolContent(emoji, suffix, size);
    else return renderSymbolFallback({ fallbackType, label: symbol.label });
  }

  return renderSymbolFallback({ fallbackType, label: symbol.label });
}

const determineRenderMode = (symbol: SymbolRecord): SymbolRenderMode | null => {
  if (symbol.imgBlob) return SymbolRenderMode.IMAGE;
  if (symbol.emoji) return SymbolRenderMode.EMOJI;
  return null;
};

const buildSymbolContent = (
  symbolEl: HTMLElement,
  suffix?: string,
  size?: number
): HTMLElement => {
  return el("span", { attrs: { role: "presentation" } }, [
    symbolEl,
    ...(suffix
      ? [
          el("span", {
            className: `${CLASS_PREFIX}__suffix`,
            textContent: suffix,
            style: { fontSize: `${size}em` },
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
  size: number,
  disableEmojiScaling?: boolean
): HTMLElement | null => {
  if (!symbol.emoji) return null;
  const scale = disableEmojiScaling ? 1 : EMOJI_SCALE;
  return el("span", {
    textContent: symbol.emoji,
    style: { fontSize: `${size * scale}em` },
  });
};

const renderSymbolFallback = ({
  fallbackType,
  label,
  suffix,
}: {
  fallbackType: SymbolFallbackType;
  label?: string;
  suffix?: string;
}): HTMLElement => {
  switch (fallbackType) {
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
