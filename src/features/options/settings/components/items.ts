import {
  SettingsSectionField,
  SettingsSectionGroup,
  SettingsSectionItem,
} from "../types";
import { PREFIX } from "../..";

import { el } from "../../../../utils/ui/dom";
import { FormItemType } from "../../../../enums/forms";

export function createSettingsSectionContent(
  items: SettingsSectionItem<any>[]
): HTMLElement {
  const fieldsWrapper = el("div", {
    className: `${PREFIX}__settings__field__wrapper`,
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
    el("legend", { className: `${PREFIX}__settings__group__label` }, [label])
  );

  // prettier-ignore
  if (description)
    children.push(el("p", {
      id: `${id}-description`,
      className: `${PREFIX}__settings__field__description`,
    }, [description]));

  // prettier-ignore
  const fieldsWrapper = el("div", { className: `${PREFIX}__settings__group__fields` }, []);
  fields.forEach((field) => {
    const fieldElement = createSettingsSectionItem(field);
    if (fieldElement) fieldsWrapper.appendChild(fieldElement);
  });
  children.push(fieldsWrapper);

  const group = el(
    "fieldset",
    { id, className: `${PREFIX}__settings__group` },
    [...children]
  );

  return group;
}

function createSettingsSectionField({
  sectionId,
  input,
  dataField,
  label,
  description,
}: SettingsSectionField<any>): HTMLElement {
  const id = `${PREFIX}__${sectionId}__${String(dataField)}`;
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
