import { SETTINGS_CLASS } from "../base";
import {
  SettingsSectionField,
  SettingsSectionGroup,
  SettingsSectionItem,
} from "../types";

import { CLASS_PREFIX } from "../../../../constants/classes";
import { el } from "../../../../utils/ui/dom";
import { FormItemType } from "../../../../enums/forms";
import { ABBREVIATION } from "../../../../constants/global";
import { CustomInputType } from "../../../../enums/ui";

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
    }, [description]));

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

  const inputEl =
    input.getAttribute("input-type") == CustomInputType.TOGGLE_SWITCH
      ? (input.querySelector("input[type='checkbox']") as HTMLInputElement)
      : input;
  inputEl.id = id;
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
    }, [description]));

  const field = el("div", { className: `${SETTINGS_CLASS}__field` }, [
    el(
      "div",
      { className: `${SETTINGS_CLASS}__field-label-wrapper` },
      children
    ),
    input,
  ]);

  return field;
}
