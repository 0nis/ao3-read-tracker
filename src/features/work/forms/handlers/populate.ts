import { walkItems } from "../helpers/items";
import { WorkFormConfig } from "../types";

export function populateWorkForm<T>(config: WorkFormConfig<T>) {
  const data = config.data;

  walkItems(config.items, (field) => {
    const key = field.dataField;
    const value = data[key];

    if (value === undefined) return;

    const input = field.input;

    switch (input.constructor) {
      case HTMLInputElement:
        switch ((input as HTMLInputElement).type) {
          case "checkbox":
            (input as HTMLInputElement).checked = Boolean(value);
            break;
          default:
            (input as HTMLInputElement).value = String(value);
        }
        break;
      case HTMLTextAreaElement:
        (input as HTMLTextAreaElement).value = String(value);
        break;
    }
  });
}
