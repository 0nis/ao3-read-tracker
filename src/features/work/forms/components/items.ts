import { CLASS_PREFIX } from "../../../../constants/classes";
import { el } from "../../../../utils/ui/dom";
import {
  WorkFormField,
  WorkFormFieldGroup,
  WorkFormFieldType,
  WorkFormItem,
} from "../types";

export function createFormContent<T>(items: WorkFormItem<T>[]): HTMLElement {
  const dl = el("dl", {}, []);
  items.forEach((item) => {
    appendFormItem(dl, item);
  });
  return dl;
}

function appendFormItem(parent: HTMLElement, item: WorkFormItem<any>) {
  const element = createWorkFormItem(item);
  if (!element) return;
  if ("dt" in element && "dd" in element) {
    parent.appendChild(element.dt);
    parent.appendChild(element.dd);
  } else {
    parent.appendChild(element);
  }
}

function createWorkFormItem(item: WorkFormItem<any>) {
  if (item.type === WorkFormFieldType.FIELD) return createWorkFormField(item);
  else if (item.type === WorkFormFieldType.GROUP)
    return createWorkFormGroup(item);
}

function createWorkFormGroup(group: WorkFormFieldGroup<any>) {
  const wrapper = el("div", { className: group.className || "" }, []);
  group.fields.forEach((item) => {
    appendFormItem(wrapper, item);
  });
  return wrapper;
}

function createWorkFormField(field: WorkFormField<any>): {
  dt: HTMLElement;
  dd: HTMLElement;
} {
  const dd: HTMLElement[] = [];
  if (field.description)
    dd.push(
      el(
        "p",
        {
          id: `${String(field.dataField)}__description`,
          className: `${CLASS_PREFIX}__footnote footnote`,
        },
        [field.description || ""]
      )
    );

  const input = field.input;
  input.id = String(field.dataField);
  input.setAttribute("data-field", String(field.dataField));
  if (field.description)
    input.setAttribute(
      "aria-describedby",
      `${String(field.dataField)}__description`
    );
  dd.push(input);

  return {
    dt: el("dt", {}, [
      el(
        "label",
        {
          htmlFor: String(field.dataField),
        },
        [field.label]
      ),
    ]),
    dd: el("dd", {}, dd),
  };
}
