import { buildBlock } from "./block/component";
import { ACCEPTED_IMAGE_TYPES, getClass } from "../../section";
import { SectionId } from "../../../../../config";
import { createSectionWrapper } from "../../../../../components/section/component";

import { symbolsCache } from "../../../../../../../services/cache";
import {
  extractImageTypeNames,
  formatBytes,
} from "../../../../../../../utils/file";
import { el } from "../../../../../../../utils/ui/dom";
import { SymbolId } from "../../../../../../../enums/symbols";
import { MAX_GIF_SIZE } from "../../../../../../../constants/global";

export async function buildSymbolDefinitionsPart(): Promise<HTMLElement> {
  const section = createSectionWrapper({
    id: SectionId.SYMBOL_SETTINGS,
    title: "Symbol Customization",
    // prettier-ignore
    description: `
      <ul>
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
