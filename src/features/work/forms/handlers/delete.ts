import { FORMS_SAVE_MAP } from "../config";
import { WorkFormConfig } from "../types";

import { handleStorageWrite } from "../../../../utils/storage/handlers";

export async function deleteWorkFormData<T>(
  cfg: WorkFormConfig<T>,
  deleteBtn: HTMLButtonElement
): Promise<void> {
  const map = FORMS_SAVE_MAP[cfg.id];
  const workId = (cfg.data as any).id;
  if (!map || !workId) return Promise.reject();

  return await handleStorageWrite(map.deleter(workId), {
    successMsg: map.deleteStr.replace(
      "%title%",
      String((cfg.data as any).title) || "this work"
    ),
    errorMsg: map.errStr.replace(
      "%title%",
      String((cfg.data as any).title) || "this work"
    ),
    loadingEl: deleteBtn,
  });
}
