import { FORMS_SAVE_MAP } from "../config";
import { WorkFormConfig } from "../types";
import { walkItems } from "../helpers/items";

import { handleStorageWrite } from "../../../../utils/storage/handlers";

export async function saveWorkFormData<T>(
  cfg: WorkFormConfig<T>,
  saveBtn: HTMLButtonElement
): Promise<void> {
  const values = extractWorkFormValues(cfg);
  const payload = { ...cfg.data, ...values };
  const map = FORMS_SAVE_MAP[cfg.id];
  if (!map) return Promise.reject();

  return await handleStorageWrite(map.putter(payload), {
    successMsg: map.saveStr.replace(
      "%title%",
      String((payload as any).title) || "this work"
    ),
    errorMsg: map.errStr.replace(
      "%title%",
      String((payload as any).title) || "this work"
    ),
    loadingEl: saveBtn,
  });
}

function extractWorkFormValues<T>(config: WorkFormConfig<T>): Partial<T> {
  const result: Partial<T> = {};

  walkItems(config.items, (field) => {
    const key = field.dataField;
    const input = field.input;

    switch (input.constructor) {
      case HTMLInputElement:
        switch ((input as HTMLInputElement).type) {
          case "checkbox":
            result[key] = (input as HTMLInputElement).checked as any;
            break;
          case "number":
            result[key] = parseInt(
              (input as HTMLInputElement).value,
              10
            ) as any;
            break;
          default:
            result[key] = (input as HTMLInputElement).value as any;
        }
        break;
      case HTMLTextAreaElement:
        result[key] = (input as HTMLTextAreaElement).value.trim() as any;
        break;
    }
  });

  return result;
}
