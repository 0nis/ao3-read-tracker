import { ACTION_HANDLER_MAP } from "./config";
import { ACTION_MESSAGES_MAP, WorkActionTypeMap } from "../config";
import { getDefaultPayload, getWorkTitleForNotifications } from "../helpers";
import { FormRegistry } from "../forms/registry";

import { getTitleFromWorkPage } from "../../../utils/ao3";
import { handleStorageWrite } from "../../../utils/storage/handlers";
import { createFlashNotice } from "../../../utils/ui/form";
import { ButtonPlacement } from "../../../enums/settings";
import { getButtonOrigin } from "./helpers";

export async function handleEditWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement
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
    getBtnOrigin(btn)
  );
}

export async function handleSaveWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const msgs = ACTION_MESSAGES_MAP[workAction];
  const payload: WorkActionTypeMap[K] = {
    ...getDefaultPayload<K>(workAction, { id } as Partial<
      WorkActionTypeMap[K]
    >),
  };

  const title = getWorkTitleForNotifications((payload as any).title);

  return await handleStorageWrite(cfg.storage.put(payload), {
    successMsg: msgs.success.save.replace("%title%", title),
    errorMsg: msgs.error.save.replace("%title%", title),
    onSuccess(message) {
      createFlashNotice(message, getBtnOrigin(btn));
    },
  });
}

export async function handleDeleteWork<K extends keyof WorkActionTypeMap>(
  id: string,
  workAction: K,
  btn?: HTMLElement
) {
  const cfg = ACTION_HANDLER_MAP[workAction];
  const msgs = ACTION_MESSAGES_MAP[workAction];
  const title = getWorkTitleForNotifications(
    getTitleFromWorkPage() || undefined
  );

  return await handleStorageWrite(cfg.storage.delete(id), {
    successMsg: msgs.success.delete.replace("%title%", title),
    errorMsg: msgs.error.delete.replace("%title%", title),
    onSuccess(message) {
      createFlashNotice(message, getBtnOrigin(btn));
    },
  });
}

const getBtnOrigin = (btn: HTMLElement | null | undefined) => {
  return btn ? getButtonOrigin(btn) : ButtonPlacement.TOP;
};
