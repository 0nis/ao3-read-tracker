import { ACTION_HANDLER_MAP } from "./config";
import { ACTION_MESSAGES_MAP, WorkActionTypeMap } from "../config";
import { getDefaultPayload, getWorkTitleForNotifications } from "../helpers";
import { FormRegistry } from "../forms/registry";

import { getTitleFromWorkPage } from "../../../utils/ao3";
import { handleStorageWrite } from "../../../utils/storage/handlers";

export async function handleEditWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K
) {
  // TODO: FIX: Navigate doesn't work
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
    !!data
  );
}

export async function handleSaveWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const msgs = ACTION_MESSAGES_MAP[workAction];
  const payload: WorkActionTypeMap[K] = {
    ...getDefaultPayload<K>({ id } as Partial<WorkActionTypeMap[K]>),
  };

  const title = getWorkTitleForNotifications((payload as any).title);

  return await handleStorageWrite(cfg.storage.put(payload), {
    successMsg: msgs.success.save.replace("%title%", title),
    errorMsg: msgs.error.save.replace("%title%", title),
  });
}

export async function handleDeleteWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const msgs = ACTION_MESSAGES_MAP[workAction];
  const title = getWorkTitleForNotifications(
    getTitleFromWorkPage() || undefined
  );

  return await handleStorageWrite(cfg.storage.delete(id), {
    successMsg: msgs.success.delete.replace("%title%", title),
    errorMsg: msgs.error.delete.replace("%title%", title),
  });
}
