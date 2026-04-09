import { ACTION_HANDLER_MAP } from "./config";
import {
  ACTION_MESSAGES_MAP,
  WorkActionEvent,
  WorkActionState,
  WorkActionTypeMap,
} from "../config";
import {
  getDefaultPayload,
  getWorkTitleForNotifications,
  placeNotice,
} from "../helpers";
import { FormRegistry } from "../forms/registry";

import {
  getCurrentChapterFromWorkPage,
  getTitleFromWorkPage,
} from "../../../utils/ao3";
import {
  handleStorageRead,
  handleStorageWrite,
} from "../../../shared/storage/handlers";
import { getFormattedDate, getFormattedTime } from "../../../utils/date";
import { createFlashNotice } from "../../../utils/ui/forms";
import { getButtonOrigin } from "../../../utils/ui/dom";
import { VerticalPlacement } from "../../../enums/settings";
import { InProgressWork } from "../../../types/works";
import { ABBREVIATION } from "../../../constants/global";

export async function handleEditWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement,
) {
  if (FormRegistry.get(workAction)) {
    FormRegistry.navigate(workAction);
    return;
  }
  const cfg = ACTION_HANDLER_MAP[workAction];
  const { data } = await cfg.storage.getById(id);

  cfg.createForm(
    {
      ...(data || {}),
      id,
      title: getTitleFromWorkPage() || "Untitled",
    } as Partial<WorkActionTypeMap[K]>,
    !!data,
    getBtnOrigin(btn),
  );
}

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
        state: WorkActionState.MARKED,
        workActionEvent: WorkActionEvent.SAVE,
      },
    }),
  );
}

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

export async function handleCheckExistence<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const exists = (await cfg.storage.exists(id)).data;
  return exists;
}

export async function handleUpdateInProgressInfo(
  id: string,
  btn?: HTMLElement,
) {
  const chapter = getCurrentChapterFromWorkPage() || undefined;

  const data = await handleStorageRead(
    ACTION_HANDLER_MAP.in_progress.storage.getById(id),
  );
  if (!data) return;

  const updateData: InProgressWork = {
    ...data,
    lastReadAt: Date.now(),
    lastReadChapter: chapter || data.lastReadChapter,
  };

  await handleStorageWrite(
    ACTION_HANDLER_MAP.in_progress.storage.put(updateData),
    {
      successMsg: `Your read progress for "${getWorkTitleForNotifications(
        updateData.title,
      )}" was updated: Last read at ${getFormattedDate(
        updateData.lastReadAt,
      )} ${getFormattedTime(updateData.lastReadAt)}, chapter ${
        updateData.lastReadChapter || "unknown"
      }.`,
      errorMsg: "Failed to update read progress.",
      loadingEl: btn,
      onSuccess(message) {
        createFlashNotice(message, {
          appendNotice: (main: HTMLElement, notice: HTMLElement) => {
            placeNotice(main, notice, getBtnOrigin(btn));
          },
          positionId: getBtnOrigin(btn),
        });
      },
    },
  );
}

const getBtnOrigin = (btn: HTMLElement | null | undefined) => {
  return btn ? getButtonOrigin(btn) : VerticalPlacement.TOP;
};
