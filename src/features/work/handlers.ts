import { CLASS_PREFIX } from "../../constants/classes";
import { StorageService } from "../../services/storage";
import { IgnoredFic, ReadFic } from "../../types/storage";
import { getTitleFromWorkPage } from "../../utils/ao3";
import { showNotification } from "../../utils/ui/dialogs";
import { Router } from "../../app/router";
import { showIgnoredFicForm } from "./form/ignoredForm";
import { showReadFicForm } from "./form/readForm";

export async function handleEditReadFicInfo(id: string): Promise<void> {
  const form = document.getElementById(`${CLASS_PREFIX}__read-form`);
  if (form) {
    Router.addHash(form.id);
    return;
  }
  const { data } = await StorageService.readFics.getById(id);
  showReadFicForm(!!data, {
    ...data,
    id,
    title: getTitleFromWorkPage() || "Untitled",
  });
}

export async function handleMarkFicAsRead(
  data: Partial<ReadFic>
): Promise<void> {
  const title = getTitleFromWorkPage() || "Untitled";
  const result = await StorageService.readFics.put({
    ...data,
    id: data.id!,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Fic ${data.id} marked as read.`);
  else
    showNotification(`Failed to mark fic ${data.id} as read: ${result.error}`);
}

export async function handleMarkFicAsUnread(id: string): Promise<void> {
  const result = await StorageService.readFics.delete(id);
  if (result.success) showNotification(`Fic ${id} marked as unread.`);
  else showNotification(`Failed to mark fic ${id} as unread: ${result.error}`);
}

export async function handleEditIgnoredFicInfo(id: string): Promise<void> {
  const form = document.getElementById(`${CLASS_PREFIX}__ignored-form`);
  if (form) {
    Router.addHash(form.id);
    return;
  }
  const { data } = await StorageService.ignoredFics.getById(id);
  showIgnoredFicForm(!!data, {
    ...data,
    id,
    title: getTitleFromWorkPage() || "Untitled",
  });
}

export async function handleIgnoreFic(
  data: Partial<IgnoredFic>
): Promise<void> {
  const title = getTitleFromWorkPage() || "Untitled";
  const result = await StorageService.ignoredFics.put({
    ...data,
    id: data.id!,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Fic ${data.id} is now being ignored.`);
  else showNotification(`Failed to ignore fic ${data.id}: ${result.error}`);
}

export async function handleUnignoreFic(id: string): Promise<void> {
  const result = await StorageService.ignoredFics.delete(id);
  if (result.success) showNotification(`Fic ${id} is no longer being ignored.`);
  else showNotification(`Failed to unignore fic ${id}: ${result.error}`);
}
