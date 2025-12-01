import { FORMS_SAVE_MAP } from "../config";
import { WorkFormConfig } from "../types";
import { walkItems } from "../helpers/items";
import { ACTION_MESSAGES_MAP, WorkActionTypeMap } from "../../config";
import { getDefaultPayload, getWorkTitleForNotifications } from "../../helpers";

import { handleStorageWrite } from "../../../../utils/storage/handlers";

export async function saveWorkFormData<K extends keyof WorkActionTypeMap>(
  cfg: WorkFormConfig<WorkActionTypeMap[K]> & { id: K },
  saveBtn: HTMLButtonElement
): Promise<void> {
  try {
    const saveMap = FORMS_SAVE_MAP[cfg.id];
    const msgMap = ACTION_MESSAGES_MAP[cfg.id];
    if (!saveMap || !msgMap)
      return Promise.reject(
        new Error(`No save map or message map for form id: ${cfg.id}`)
      );

    const values = extractWorkFormValues(cfg);
    const payload: WorkActionTypeMap[K] = {
      ...getDefaultPayload<K>(cfg.data),
      ...values,
    };

    const { success, error } = cfg.editing
      ? { success: msgMap.success.edit, error: msgMap.error.edit }
      : { success: msgMap.success.save, error: msgMap.error.save };

    const title = getWorkTitleForNotifications((payload as any).title);

    return await handleStorageWrite(saveMap.putter(payload), {
      successMsg: success.replace("%title%", title),
      errorMsg: error.replace("%title%", title),
      loadingEl: saveBtn,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

function extractWorkFormValues<K extends keyof WorkActionTypeMap>(
  config: WorkFormConfig<WorkActionTypeMap[K]>
): Partial<WorkActionTypeMap[K]> {
  const result: Partial<WorkActionTypeMap[K]> = {};

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
