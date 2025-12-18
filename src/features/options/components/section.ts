import { CLASS_PREFIX } from "../../../constants/classes";
import { el } from "../../../utils/ui/dom";
import { SectionConfig } from "../types";

export function createSectionWrapper(config: SectionConfig): HTMLElement {
  const header = createSectionHeaderEl(config);

  const section = el(
    "section",
    {
      className: `${CLASS_PREFIX}__section`,
      id: `section-${config.id}`,
      attrs: {
        role: "region",
        "aria-labelledby": header.id,
      },
    },
    [header.el]
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
    el: el("div", { className: `${CLASS_PREFIX}__section-header` }, [
      el(
        "h3",
        {
          className: `${CLASS_PREFIX}__section-title`,
          id: titleId,
        },
        [title]
      ),
      ...(headerChildren || []),
    ]),
    id: titleId,
  };
}

function createSectionDescriptionEl(
  id: string,
  description: string
): {
  el: HTMLElement;
  id: string;
} {
  const descId = `section-${id}-description`;
  return {
    el: el("p", {
      id: descId,
      className: `${CLASS_PREFIX}__section-description`,
      innerHTML: description,
    }),
    id: descId,
  };
}
