import { getStyles } from "./style";
import { buildDisplayModePrioritesPart } from "./parts/settings";

import { el, injectStyles } from "../../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../../constants/classes";

export const getClass = () => `${CLASS_PREFIX}__display-modes`;

export async function buildDisplayModesSection() {
  injectStyles(`${CLASS_PREFIX}__styles--display-modes`, getStyles(getClass()));

  return el("div", {}, [await buildDisplayModePrioritesPart()]);
}
