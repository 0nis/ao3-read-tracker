import { getStyles } from "./style";
import { PREFIX } from "..";
import { createSection, SectionConfig } from "../components/section";

import { el, injectStyles } from "../../../utils/ui/dom";

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

export interface FieldConfig<T> {
  section: string;
  label: string;
  input: HTMLElement;
  dataField: keyof T;
  description?: string;
}

export function createField<T>({
  section,
  input,
  dataField,
  label,
  description,
}: FieldConfig<T>): HTMLElement {
  const id = `${PREFIX}__${section}__${String(dataField)}`;
  input.id = id;
  input.setAttribute("data-field", String(dataField));
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

export interface FieldGroupConfig {
  id: string;
  label: string;
  fields: HTMLElement[];
  description?: string;
}

export function createFieldGroup({
  id,
  label,
  fields,
  description,
}: FieldGroupConfig): HTMLElement {
  const children: HTMLElement[] = [];

  children.push(
    el("legend", { className: `${PREFIX}__settings__group__label` }, [label])
  );

  // prettier-ignore
  if (description)
    children.push(el("p", {
      id: `${id}-description`,
      className: `${PREFIX}__settings__field__description`,
    }, [description]));

  children.push(
    el("div", { className: `${PREFIX}__settings__group__fields` }, fields)
  );

  const group = el(
    "fieldset",
    { id, className: `${PREFIX}__settings__group` },
    [...children]
  );

  return group;
}
