import { SETTINGS_CLASS } from "../base";
import {
  SettingsSectionField,
  SettingsSectionGroup,
  SettingsSectionItem,
} from "../types";

import { el } from "../../../../utils/ui/dom";
import { getInputElement } from "../../../../utils/ui/forms";
import { FormItemType } from "../../../../enums/forms";
import { CLASS_PREFIX } from "../../../../constants/classes";

export function createSettingsSectionContent(
  items: SettingsSectionItem<any>[]
): HTMLElement {
  const fieldsWrapper = el("div", {
    className: `${SETTINGS_CLASS}__field-wrapper`,
  });
  items.forEach((item) => {
    const itemElement = createSettingsSectionItem(item);
    if (itemElement) fieldsWrapper.appendChild(itemElement);
  });
  return fieldsWrapper;
}

function createSettingsSectionItem(
  item: SettingsSectionItem<any>
): HTMLElement | null {
  if (item.type === FormItemType.FIELD) return createSettingsSectionField(item);
  else if (item.type === FormItemType.GROUP)
    return createSettingsSectionGroup(item);
  return null;
}

function createSettingsSectionGroup({
  id,
  label,
  fields,
  description,
}: SettingsSectionGroup<any>): HTMLElement {
  const children: HTMLElement[] = [];

  children.push(
    el("legend", { className: `${SETTINGS_CLASS}__group-label` }, [label])
  );

  // prettier-ignore
  if (description)
    children.push(el("p", {
      id: `${id}-description`,
      className: `${SETTINGS_CLASS}__field-description`,
      innerHTML: description
    }));

  // prettier-ignore
  const fieldsWrapper = el("div", { className: `${SETTINGS_CLASS}__group-fields` }, []);
  fields.forEach((field) => {
    const fieldElement = createSettingsSectionItem(field);
    if (fieldElement) fieldsWrapper.appendChild(fieldElement);
  });
  children.push(fieldsWrapper);

  const group = el("fieldset", { id, className: `${SETTINGS_CLASS}__group` }, [
    ...children,
  ]);

  return group;
}

function createSettingsSectionField({
  sectionId,
  input,
  dataField,
  label,
  description,
}: SettingsSectionField<any>): HTMLElement {
  const id = `${CLASS_PREFIX}__${sectionId}__${String(dataField)}`;

  const inputEl = getInputElement(input) ?? input;
  inputEl.id = id;
  inputEl.classList.add(`${SETTINGS_CLASS}__field-input`);
  inputEl.setAttribute("data-field", String(dataField));
  if (description)
    inputEl.setAttribute("aria-describedby", `${id}-description`);

  const children = [
    el("label", { attrs: { for: id } }, [label]),
  ] as HTMLElement[];

  // prettier-ignore
  if (description)
    children.push(el("p", {
      id: `${id}-description`,
      className: `${SETTINGS_CLASS}__field-description`,
      innerHTML: description
    }));

  const isCheckbox =
    inputEl instanceof HTMLInputElement && inputEl.type === "checkbox";

  const field = el(
    "div",
    {
      className: `${SETTINGS_CLASS}__field ${
        isCheckbox ? `${SETTINGS_CLASS}__field--checkbox` : ""
      }`,
    },
    [
      el(
        "div",
        { className: `${SETTINGS_CLASS}__field-label-wrapper` },
        children
      ),
      el("div", { className: `${SETTINGS_CLASS}__field-input-wrapper` }, input),
    ]
  );

  return field;
}
