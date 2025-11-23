import { PREFIX } from "../..";
import { el } from "../../../../utils/ui/dom";

export interface SectionConfig {
  id: string;
  title: string;
}

export function createSection(config: SectionConfig) {
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
