import { getStyles } from "./style";
import { buildSymbolDefinitionsPart } from "./parts/definitions/part";

import { el, injectStyles } from "../../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { buildSymbolSettingsPart } from "./parts/settings";

export const ACCEPTED_IMAGE_TYPES =
  "image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/x-icon,image/vnd.microsoft.icon";

export const getClass = () => `${CLASS_PREFIX}__symbol-section`;

export async function buildSymbolsSection(): Promise<HTMLElement> {
  injectStyles(
    `${CLASS_PREFIX}__styles--symbol-section`,
    getStyles(getClass()),
  );

  return el("div", {}, [
    await buildSymbolSettingsPart(),
    await buildSymbolDefinitionsPart(),
  ]);
}
