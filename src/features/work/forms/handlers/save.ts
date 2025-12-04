import { FORMS_SAVE_MAP } from "../config";
import { WorkFormConfig } from "../types";
import { walkItems } from "../helpers/items";
import { ACTION_MESSAGES_MAP, WorkActionTypeMap } from "../../config";
import { getDefaultPayload, getWorkTitleForNotifications } from "../../helpers";

import { handleStorageWrite } from "../../../../utils/storage";
import { ButtonPlacement } from "../../../../enums/settings";
import { createFlashNotice } from "../../../../utils/ui/forms";

export async function saveWorkFormData<K extends keyof WorkActionTypeMap>(
  cfg: WorkFormConfig<WorkActionTypeMap[K]> & { id: K },
  saveBtn: HTMLButtonElement,
  origin?: ButtonPlacement
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
      ...getDefaultPayload<K>(cfg.id, cfg.data),
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
      onSuccess(message) {
        createFlashNotice(message, origin);
      },
      enforceMinDelay: true,
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
        const inputEl = input as HTMLInputElement;
        switch (inputEl.type) {
          case "checkbox":
            result[key] = inputEl.checked as any;
            break;
          case "number":
            result[key] = parseInt(inputEl.value, 10) as any;
            break;
          case "datetime-local":
            result[key] = new Date(inputEl.value).getTime() as any;
            break;

          default:
            result[key] = inputEl.value as any;
        }
        break;
      case HTMLTextAreaElement:
        const textareaEl = input as HTMLTextAreaElement;
        result[key] = textareaEl.value.trim() as any;
        break;
    }
  });

  return result;
}
