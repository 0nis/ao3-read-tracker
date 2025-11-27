import { Router } from "@app/router";
import { StorageService } from "@services/storage";
import { CLASS_PREFIX } from "@constants";
import { IgnoredWork, ReadWork } from "@types";
import { getTitleFromWorkPage } from "@utils/ao3";
import { showNotification } from "@utils/ui";

import { showIgnoredWorkForm } from "./form/ignoredForm";
import { showReadWorkForm } from "./form/readForm";

export async function handleEditReadWorkInfo(id: string): Promise<void> {
  const form = document.getElementById(`${CLASS_PREFIX}__read-form`);
  if (form) {
    Router.addHash(form.id);
    return;
  }
  const { data } = await StorageService.readWorks.getById(id);
  showReadWorkForm(!!data, {
    ...data,
    id,
    title: getTitleFromWorkPage() || "Untitled",
  });
}

export async function handleMarkWorkAsRead(
  data: Partial<ReadWork>
): Promise<void> {
  const title = getTitleFromWorkPage() || "Untitled";
  const result = await StorageService.readWorks.put({
    ...data,
    id: data.id!,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Work ${data.id} marked as read.`);
  else
    showNotification(`Failed to mark work ${data.id} as read: ${result.error}`);
}

export async function handleMarkWorkAsUnread(id: string): Promise<void> {
  const result = await StorageService.readWorks.delete(id);
  if (result.success) showNotification(`Work ${id} marked as unread.`);
  else showNotification(`Failed to mark work ${id} as unread: ${result.error}`);
}

export async function handleEditIgnoredWorkInfo(id: string): Promise<void> {
  const form = document.getElementById(`${CLASS_PREFIX}__ignored-form`);
  if (form) {
    Router.addHash(form.id);
    return;
  }
  const { data } = await StorageService.ignoredWorks.getById(id);
  showIgnoredWorkForm(!!data, {
    ...data,
    id,
    title: getTitleFromWorkPage() || "Untitled",
  });
}

export async function handleIgnoreWork(
  data: Partial<IgnoredWork>
): Promise<void> {
  const title = getTitleFromWorkPage() || "Untitled";
  const result = await StorageService.ignoredWorks.put({
    ...data,
    id: data.id!,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Work ${data.id} is now being ignored.`);
  else showNotification(`Failed to ignore work ${data.id}: ${result.error}`);
}

export async function handleUnignoreWork(id: string): Promise<void> {
  const result = await StorageService.ignoredWorks.delete(id);
  if (result.success)
    showNotification(`Work ${id} is no longer being ignored.`);
  else showNotification(`Failed to unignore Work ${id}: ${result.error}`);
}
