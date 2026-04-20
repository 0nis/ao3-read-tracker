import { FORMS_SAVE_MAP } from "../config";
import { WorkFormConfig } from "../types";
import { ACTION_MESSAGES_MAP, WorkActionTypeMap } from "../../config";
import { placeNotice } from "../../helpers";
import { getDefaultPayload } from "../../payload";

import { handleStorageWrite } from "../../../../shared/storage/handlers";
import { getWorkTitleForNotifications } from "../../../../shared/ao3";
import {
  createFlashNotice,
  extractFormValues,
} from "../../../../utils/ui/forms";
import { VerticalPlacement } from "../../../../enums/settings";

export async function saveWorkFormData<K extends keyof WorkActionTypeMap>(
  cfg: WorkFormConfig<WorkActionTypeMap[K]> & { id: K },
  saveBtn: HTMLButtonElement,
  origin?: VerticalPlacement,
): Promise<void> {
  try {
    const saveMap = FORMS_SAVE_MAP[cfg.id];
    const msgMap = ACTION_MESSAGES_MAP[cfg.id];
    if (!saveMap || !msgMap)
      return Promise.reject(
        new Error(`No save map or message map for form id: ${cfg.id}`),
      );

    const values = extractFormValues(cfg.items);
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
        createFlashNotice(message, {
          appendNotice: (main: HTMLElement, notice: HTMLElement) => {
            placeNotice(main, notice, origin || VerticalPlacement.TOP);
          },
          positionId: origin || VerticalPlacement.TOP,
        });
      },
      enforceMinDelay: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}
