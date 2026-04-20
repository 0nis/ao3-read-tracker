import { ACTION_HANDLER_MAP } from "../config";
import { getBtnOrigin } from "../helpers/placement";
import {
  ACTION_MESSAGES_MAP,
  WorkActionEvent,
  WorkActionState,
  WorkActionTypeMap,
} from "../../config";
import { placeNotice, getTitleFromWorkPage } from "../../helpers";

import { handleStorageWrite } from "../../../../shared/storage/handlers";
import { getWorkTitleForNotifications } from "../../../../shared/ao3";
import { createFlashNotice } from "../../../../utils/ui/forms";
import { ABBREVIATION } from "../../../../constants/global";

export async function handleDeleteWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement,
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const msgs = ACTION_MESSAGES_MAP[workAction];
  const title = getWorkTitleForNotifications(
    getTitleFromWorkPage() || undefined,
  );

  await handleStorageWrite(cfg.storage.delete(id), {
    successMsg: msgs.success.delete.replace("%title%", title),
    errorMsg: msgs.error.delete.replace("%title%", title),
    onSuccess(message) {
      createFlashNotice(message, {
        appendNotice: (main: HTMLElement, notice: HTMLElement) => {
          placeNotice(main, notice, getBtnOrigin(btn));
        },
        positionId: getBtnOrigin(btn),
      });
    },
  });

  document.dispatchEvent(
    new CustomEvent(`${ABBREVIATION}:updated`, {
      detail: {
        workAction,
        state: WorkActionState.UNMARKED,
        workActionEvent: WorkActionEvent.DELETE,
      },
    }),
  );
}
