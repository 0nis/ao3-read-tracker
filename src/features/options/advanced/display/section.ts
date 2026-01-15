import { getStyles } from "./style";

import { SectionId } from "../../config";
import { createSectionWrapper } from "../../components/section/component";

import { injectStyles } from "../../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../../constants/classes";

const DISPLAY_CLASS = `${CLASS_PREFIX}__display-modes`;

export function buildDisplayModesSection() {
  injectStyles(`${CLASS_PREFIX}__styles--data`, getStyles(DISPLAY_CLASS));

  const section = createSectionWrapper({
    id: SectionId.DISPLAY_MODES,
    title: "Custom Display Modes",
  });

  return section;
}
