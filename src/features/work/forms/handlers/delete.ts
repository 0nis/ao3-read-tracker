import { FORMS_SAVE_MAP } from "../config";
import { WorkFormConfig } from "../types";
import { ACTION_MESSAGES_MAP, WorkActionTypeMap } from "../../config";
import { getWorkTitleForNotifications } from "../../helpers";

import { handleStorageWrite } from "../../../../utils/storage";
import { VerticalPlacement } from "../../../../enums/settings";
import { createFlashNotice } from "../../../../utils/ui/forms";

export async function deleteWorkFormData<K extends keyof WorkActionTypeMap>(
  cfg: WorkFormConfig<WorkActionTypeMap[K]>,
  deleteBtn: HTMLButtonElement,
  origin?: VerticalPlacement
): Promise<void> {
  const saveMap = FORMS_SAVE_MAP[cfg.id];
  const msgMap = ACTION_MESSAGES_MAP[cfg.id];
  const workId = (cfg.data as any).id;
  if (!saveMap || !msgMap)
    return Promise.reject(
      new Error(`No save map or message map for form id: ${cfg.id}`)
    );
  if (!workId)
    return Promise.reject(new Error("No id found for work to delete"));

  const title = getWorkTitleForNotifications((cfg.data as any).title);

  return await handleStorageWrite(saveMap.deleter(workId), {
    successMsg: msgMap.success.delete.replace("%title%", title),
    errorMsg: msgMap.error.delete.replace("%title%", title),
    loadingEl: deleteBtn,
    onSuccess(message) {
      createFlashNotice(message, origin);
    },
  });
}
