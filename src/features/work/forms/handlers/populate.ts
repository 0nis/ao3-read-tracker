import { walkItems } from "../helpers/items";
import { WorkFormConfig } from "../types";
import { WorkActionTypeMap } from "../../config";
import { getLocalDateTimeString } from "../../../../utils/date";
import { ABBREVIATION } from "../../../../constants/global";

export function populateWorkForm<K extends keyof WorkActionTypeMap>(
  config: WorkFormConfig<WorkActionTypeMap[K]>
) {
  const data = config.data;

  walkItems(config.items, (field) => {
    if (field.ignorePopulate === true) return;

    const key = field.dataField;
    const value = data[key];
    const input = field.input;

    switch (input.constructor) {
      case HTMLInputElement:
        const inputEl = input as HTMLInputElement;
        switch (inputEl.type) {
          case "checkbox":
            inputEl.checked = Boolean(value);
            break;
          case "number":
            inputEl.value = value ? String(value) : inputEl.defaultValue || "";
            break;
          case "datetime-local":
            inputEl.value = value
              ? getLocalDateTimeString(new Date(value as number))
              : inputEl.defaultValue || "";
            break;
          default:
            inputEl.value = value ? String(value) : "";
            break;
        }
        break;
      case HTMLTextAreaElement:
        const textareaEl = input as HTMLTextAreaElement;
        textareaEl.value = value ? String(value) : "";
        break;
      case HTMLSelectElement:
        const selectEl = input as HTMLSelectElement;
        selectEl.value = value
          ? String(value)
          : selectEl.getAttribute("default-value") || "";
        break;
      case HTMLDivElement:
        switch (field.input.getAttribute("input-type")) {
          case `${ABBREVIATION}-toggle-switch`:
            const toggleInput = input.querySelector(
              "input[type='checkbox']"
            ) as HTMLInputElement;
            if (toggleInput) toggleInput.checked = Boolean(value);
            break;
        }
        break;
    }
  });
}
