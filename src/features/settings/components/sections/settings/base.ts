import { PREFIX } from "../../..";
import { el, injectStyles } from "../../../../../utils/ui/dom";
import { createSection, SectionConfig } from "../helpers";
import { getStyles } from "./style";

export interface SettingsSectionConfig extends SectionConfig {
  fields: HTMLElement[];
}

export function createSettingsSection(
  config: SettingsSectionConfig
): HTMLElement {
  const section = createSection(config);
  injectStyles(`${PREFIX}__styles--settings-section`, getStyles(PREFIX));

  const fieldsWrapper = el("div", {
    className: `${PREFIX}__settings__field__wrapper`,
  });
  config.fields.forEach((f) => fieldsWrapper.appendChild(f));
  section.appendChild(fieldsWrapper);

  const actions = el(
    "div",
    { className: `actions ${PREFIX}__settings__actions` },
    [
      el(
        "button",
        {
          className: `button ${PREFIX}__button ${PREFIX}__button--save`,
          attrs: { "aria-label": `Save ${config.title}`, type: "submit" },
        },
        ["Save"]
      ),
    ]
  );
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
      className: `${PREFIX}__settings__field__description`,
    }, [description]));

  const field = el("div", { className: `${PREFIX}__settings__field` }, [
    el(
      "div",
      { className: `${PREFIX}__settings__field__label__wrapper` },
      children
    ),
    input,
  ]);

  return field;
}
