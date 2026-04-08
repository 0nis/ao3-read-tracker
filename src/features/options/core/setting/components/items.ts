import { SETTINGS_CLASS } from "../base";
import {
  SettingsSectionField,
  SettingsSectionGroup,
  SettingsSectionItem,
} from "../types";

import { el } from "../../../../../utils/ui/dom";
import { getInputElement } from "../../../../../utils/ui/forms";
import { FormItemType } from "../../../../../enums/forms";
import { CLASS_PREFIX } from "../../../../../constants/classes";

export function createSettingsSectionContent(
  items: SettingsSectionItem<any>[],
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
  item: SettingsSectionItem<any>,
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
  boldFieldLabels,
  collapsible,
  collapsedByDefault,
}: SettingsSectionGroup<any>): HTMLElement {
  const children: HTMLElement[] = [];

  const header = el(
    "div",
    {
      className: `${SETTINGS_CLASS}__group-header`,
      ...(collapsible && {
        attrs: {
          role: "button",
          tabindex: "0",
          "aria-controls": `${id}-fields`,
        },
      }),
    },
    [
      el("div", { className: `${SETTINGS_CLASS}__group-label` }, [label]),
      ...(description
        ? [
            el("p", {
              id: `${id}-description`,
              className: `${SETTINGS_CLASS}__field-description`,
              innerHTML: description,
            }),
          ]
        : []),
    ],
  );
  children.push(header);

  const fieldsWrapper = el("div", {
    id: `${id}-fields`,
    className: `${SETTINGS_CLASS}__group-fields ${
      boldFieldLabels
        ? `${SETTINGS_CLASS}__group-fields-labels--bold`
        : `${SETTINGS_CLASS}__group-fields-labels--normal`
    }`,
  });
  fields.forEach((field) => {
    const fieldElement = createSettingsSectionItem(field);
    if (fieldElement) fieldsWrapper.appendChild(fieldElement);
  });
  children.push(fieldsWrapper);

  const group = el(
    "fieldset",
    {
      id,
      className: `${SETTINGS_CLASS}__group`,
      ...(collapsible && {
        attrs: {
          "data-collapsible": "true",
        },
      }),
    },
    children,
  );

  if (collapsible) setupCollapsibleGroup(group, header, collapsedByDefault);

  return group;
}

function setupCollapsibleGroup(
  group: HTMLElement,
  header: HTMLElement,
  collapsedByDefault?: boolean,
) {
  const isCollapsed = !!collapsedByDefault;

  header.setAttribute("aria-expanded", String(!isCollapsed));
  if (isCollapsed) {
    group.setAttribute("data-collapsed", "");
  }

  const toggle = () => {
    const collapsed = group.hasAttribute("data-collapsed");
    group.toggleAttribute("data-collapsed", !collapsed);
    header.setAttribute("aria-expanded", String(collapsed));
  };

  header.addEventListener("click", toggle);
  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
}

function createSettingsSectionField({
  sectionId,
  input,
  dataField,
  label,
  description,
  orientation = "horizontal",
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
      className: `${SETTINGS_CLASS}__field ${SETTINGS_CLASS}__field--${orientation} ${
        isCheckbox ? `${SETTINGS_CLASS}__field--checkbox` : ""
      }`,
    },
    [
      el(
        "div",
        { className: `${SETTINGS_CLASS}__field-label-wrapper` },
        children,
      ),
      el("div", { className: `${SETTINGS_CLASS}__field-input-wrapper` }, input),
    ],
  );

  return field;
}
