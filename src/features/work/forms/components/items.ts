import type { WorkFormField, WorkFormFieldGroup, WorkFormItem } from "../types";

import { el } from "../../../../utils/dom";
import { CLASS_PREFIX } from "../../../../constants/classes";
import { FormItemType } from "../../../../ui/forms/enums";

export function createFormContent(items: WorkFormItem<any>[]): HTMLElement {
  const dl = el("dl", {}, []);
  items.forEach((item) => {
    const element = createWorkFormItem(item);
    if (!element) return;
    dl.appendChild(element);
  });
  return dl;
}

function createWorkFormItem(item: WorkFormItem<any>) {
  if (item.type === FormItemType.FIELD) return createWorkFormField(item);
  else if (item.type === FormItemType.GROUP) return createWorkFormGroup(item);
}

function createWorkFormGroup(group: WorkFormFieldGroup<any>) {
  const wrapper = el("div", { className: group.className || "" }, []);
  group.fields.forEach((item) => {
    const element = createWorkFormItem(item);
    if (!element) return;
    wrapper.appendChild(element);
  });
  return wrapper;
}

function createWorkFormField(field: WorkFormField<any>): HTMLElement {
  const dd: HTMLElement[] = [];
  if (field.description)
    dd.push(
      el(
        "p",
        {
          id: `${String(field.dataField)}__description`,
          className: `${CLASS_PREFIX}__footnote footnote`,
        },
        [field.description || ""],
      ),
    );

  const input = field.input;
  input.id = String(field.dataField);
  input.setAttribute("data-field", String(field.dataField));
  if (field.description)
    input.setAttribute(
      "aria-describedby",
      `${String(field.dataField)}__description`,
    );
  dd.push(input);

  return el("div", { className: `${CLASS_PREFIX}__form__field` }, [
    el("dt", {}, [
      el(
        "label",
        {
          htmlFor: String(field.dataField),
        },
        [field.label],
      ),
    ]),
    el("dd", {}, dd),
  ]);
}
