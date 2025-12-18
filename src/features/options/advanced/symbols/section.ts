import { buildBlock } from "./block/component";
import { getStyles } from "./style";

import { SectionId } from "../../config";
import { createSectionWrapper } from "../../components/section";

import { symbolsCache } from "../../../../services/cache";
import { el, injectStyles } from "../../../../utils/ui/dom";
import { SymbolId } from "../../../../enums/symbols";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { extractImageTypeNames, formatBytes } from "../../../../utils/file";
import { IMAGE_PIXEL_HEIGHT, MAX_GIF_SIZE } from "../../../../constants/global";

export const ACCEPTED_IMAGE_TYPES =
  "image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/x-icon,image/vnd.microsoft.icon,image/cur";

export const getClass = () => `${CLASS_PREFIX}__symbol-section`;

export async function buildSymbolsSection(): Promise<HTMLElement> {
  injectStyles(
    `${CLASS_PREFIX}__styles--symbol-section`,
    getStyles(getClass())
  );

  const section = createSectionWrapper({
    id: SectionId.SYMBOLS,
    title: "Symbol Modification",
    // prettier-ignore
    description: `
      This section allows you to modify the icons or emojis used for symbols throughout the extension.<br> 
      <ul>
        <li>
          If no image is selected, the emoji will be used instead. 
          If neither are present, the label will be used.
        </li>
        <li>
          You can upload images of any of the following types: <strong>${extractImageTypeNames(ACCEPTED_IMAGE_TYPES).join(", ")}</strong>. 
          GIFs may be up to ${formatBytes(MAX_GIF_SIZE)} in size.
        </li>
        <li>
          The order in which symbols are displayed is determined by their priority: 
          the higher the priority number, the earlier they will appear in the UI.
        </li>
      </ul>
    `,
  });

  const symbols = await symbolsCache.get();

  const blocks = await Promise.all(
    Object.values(symbols).map((symbol) => {
      return buildBlock(symbol.id as SymbolId, symbol, symbols);
    })
  );

  section.appendChild(el("ul", { className: `${getClass()}__grid` }, blocks));

  return section;
}
