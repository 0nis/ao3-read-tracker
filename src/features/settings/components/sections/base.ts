import { PREFIX } from "../..";
import { el } from "../../../../utils/dom";

export interface SectionConfig {
  id: string;
  title: string;
  fields: HTMLElement[];
}

export function createSection(config: SectionConfig): HTMLElement {
  // prettier-ignore
  const section = el(
    "section",
    {
      className: `${PREFIX}__section`,
      id: `section-${config.id}`,
      attrs: { 
        role: "region", 
        "aria-labelledby": `section-${config.id}-title` 
      },
    },
    [el("h3", { 
      className: `${PREFIX}__section__title`, 
      id: `section-${config.id}-title` 
    }, [config.title])]
  );

  const fieldsWrapper = el("div", { className: `${PREFIX}__field__wrapper` });
  config.fields.forEach((f) => fieldsWrapper.appendChild(f));
  section.appendChild(fieldsWrapper);

  const actions = el("div", { className: `actions ${PREFIX}__actions` }, [
    el(
      "button",
      {
        className: `button ${PREFIX}__button ${PREFIX}__button--save`,
        attrs: { "aria-label": `Save ${config.title}`, type: "submit" },
      },
      ["Save"]
    ),
  ]);
  section.appendChild(actions);

  return section;
}

export interface FieldConfig {
  section: string;
  label: string;
  input: HTMLElement;
  dataField: string;
  description?: string;
}

export function createField({
  section,
  input,
  dataField,
  label,
  description,
}: FieldConfig): HTMLElement {
  const id = `${PREFIX}__${section}__${dataField}`;
  input.id = id;
  input.setAttribute("data-field", dataField);
  if (description) input.setAttribute("aria-describedby", `${id}-description`);

  const children = [
    el("label", { attrs: { for: id } }, [label]),
  ] as HTMLElement[];

  // prettier-ignore
  if (description)
    children.push(el("p", {
      id: `${id}-description`,
      className: `${PREFIX}__field__description`,
    }, [description]));

  const field = el("div", { className: `${PREFIX}__field` }, [
    el("div", { className: `${PREFIX}__field__label__wrapper` }, children),
    input,
  ]);

  return field;
}
