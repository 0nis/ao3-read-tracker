import { ACTION_HANDLER_MAP } from "../config";
import {
  ACTION_MESSAGES_MAP,
  WorkActionEvent,
  WorkActionState,
  WorkActionTypeMap,
} from "../../config";
import { createNoticeHandler } from "../../helpers";
import { getDefaultPayload } from "../../payload";

import { handleStorageWrite } from "../../../../shared/storage/handlers";
import { getWorkTitleForNotifications } from "../../../../shared/ao3";
import { ABBREVIATION } from "../../../../constants/global";

export async function handleSaveWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement,
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const msgs = ACTION_MESSAGES_MAP[workAction];
  const payload: WorkActionTypeMap[K] = {
    ...getDefaultPayload<K>(workAction, { id } as Partial<
      WorkActionTypeMap[K]
    >),
  };

  const title = getWorkTitleForNotifications((payload as any).title);

  await handleStorageWrite(cfg.storage.put(payload), {
    successMsg: msgs.success.save.replace("%title%", title),
    errorMsg: msgs.error.save.replace("%title%", title),
    onSuccess: createNoticeHandler(btn),
  });

  document.dispatchEvent(
    new CustomEvent(`${ABBREVIATION}:updated`, {
      detail: {
        workAction,
        state: WorkActionState.MARKED,
        workActionEvent: WorkActionEvent.SAVE,
      },
    }),
  );
}
