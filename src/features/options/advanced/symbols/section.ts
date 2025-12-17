import { buildBlock } from "./block/component";
import { getStyles } from "./style";

import { SectionId } from "../../config";
import { createSectionWrapper } from "../../components/section";

import { symbolsCache } from "../../../../services/cache";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { SymbolId } from "../../../../enums/symbols";
import { CLASS_PREFIX } from "../../../../constants/classes";

export const getClass = () => `${CLASS_PREFIX}__symbol-section`;

export async function buildSymbolsSection(): Promise<HTMLElement> {
  injectStyles(
    `${CLASS_PREFIX}__styles--symbol-section`,
    getStyles(getClass())
  );

  const section = createSectionWrapper({
    id: SectionId.SYMBOLS,
    title: "Symbol Modification",
    description:
      "This section allows you to modify the icons or emojis used for symbols throughout the extension.",
  });

  const symbols = await symbolsCache.get();

  const blocks = Object.values(symbols).map((symbol) => {
    return buildBlock(symbol.id as SymbolId, symbol);
  });

  section.appendChild(el("ul", { className: `${getClass()}__grid` }, blocks));

  return section;
}
