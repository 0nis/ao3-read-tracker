import { PREFIX } from "..";
import { el } from "../../../utils/ui/dom";
import { SectionConfig } from "../types";

export function createSection(config: SectionConfig): HTMLElement {
  return el(
    "section",
    {
      className: `${PREFIX}__section`,
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
          className: `${PREFIX}__section__title`,
          id: `section-${config.id}-title`,
        },
        [config.title]
      ),
    ]
  );
}
