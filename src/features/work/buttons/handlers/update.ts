import { ACTION_HANDLER_MAP } from "../config";
import {
  getCurrentChapterFromWorkPage,
  createNoticeHandler,
} from "../../helpers";

import {
  handleStorageRead,
  handleStorageWrite,
} from "../../../../shared/storage/handlers";
import { getWorkTitleForNotifications } from "../../../../shared/ao3";
import { getFormattedDate, getFormattedTime } from "../../../../utils/date";
import { InProgressWork } from "../../../../types/works";

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
      onSuccess: createNoticeHandler(btn),
    },
  );
}
