import { PREFIX } from "../..";
import { el } from "../../../../utils/dom";

export interface SectionConfig {
  id: string;
  title: string;
  fields: HTMLElement[];
}

export function createSection(config: SectionConfig): HTMLElement {
  const section = el("section", {
    className: `${PREFIX}__section`,
    id: `section-${config.id}`,
  });
  section.appendChild(el("h3", {}, [config.title]));

  const fieldsWrapper = el("div");
  config.fields.forEach((f) => fieldsWrapper.appendChild(f));
  section.appendChild(fieldsWrapper);

  const actions = el("div", { className: `${PREFIX}__actions` });
  const saveBtn = el(
    "button",
    { className: `${PREFIX}__button`, type: "button" },
    ["Save"]
  );
  actions.appendChild(saveBtn);
  section.appendChild(actions);

  return section;
}
