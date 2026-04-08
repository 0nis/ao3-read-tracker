import { getStyles } from "./style";
import { SectionConfig } from "../../../types";

import { el, injectStyles } from "../../../../../utils/ui/dom";
import { CLASS_PREFIX } from "../../../../../constants/classes";

const getClass = () => `${CLASS_PREFIX}__section`;

export function createSectionWrapper(config: SectionConfig): HTMLElement {
  injectStyles(
    `${CLASS_PREFIX}__styles--options-section`,
    getStyles(getClass()),
  );

  const header = createSectionHeaderEl(config);

  const section = el(
    "section",
    {
      className: `${getClass()}`,
      id: `section-${config.id}`,
      attrs: {
        role: "region",
        "aria-labelledby": header.id,
      },
    },
    [header.el],
  );

  if (config.description) {
    const desc = createSectionDescriptionEl(config.id, config.description);
    section.appendChild(desc.el);
    section.setAttribute("aria-describedby", desc.id);
  }

  return section;
}

function createSectionHeaderEl({ id, title, headerChildren }: SectionConfig): {
  el: HTMLElement;
  id: string;
} {
  const titleId = `section-${id}-title`;
  return {
    el: el("div", { className: `${getClass()}-header` }, [
      el(
        "h3",
        {
          className: `${getClass()}-title`,
          id: titleId,
        },
        [title],
      ),
      ...(headerChildren || []),
    ]),
    id: titleId,
  };
}

function createSectionDescriptionEl(
  id: string,
  description: string,
): {
  el: HTMLElement;
  id: string;
} {
  const descId = `section-${id}-description`;
  return {
    el: el("p", {
      id: descId,
      className: `${getClass()}-description`,
      innerHTML: description,
    }),
    id: descId,
  };
}
