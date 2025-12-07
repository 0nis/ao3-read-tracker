import { CLASS_PREFIX } from "../../../constants/classes";
import { el } from "../../../utils/ui/dom";
import { SectionConfig } from "../types";

export function createSection(config: SectionConfig): HTMLElement {
  return el(
    "section",
    {
      className: `${CLASS_PREFIX}__section`,
      id: `section-${config.id}`,
      attrs: {
        role: "region",
        "aria-labelledby": `section-${config.id}-title`,
      },
    },
    [
      el(
        "h3",
        {
          className: `${CLASS_PREFIX}__section-title`,
          id: `section-${config.id}-title`,
        },
        [config.title]
      ),
    ]
  );
}
