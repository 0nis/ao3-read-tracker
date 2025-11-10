import {
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";
import { StorageService } from "../../services/storage";
import { IgnoredFic, ReadFic, Settings } from "../../types/storage";
import { getTitleFromWorkPage } from "../../utils/ao3";
import { showNotification } from "../../utils/ui";
import { showIgnoredFicForm } from "./form/ignoredForm";
import { showReadFicForm } from "./form/readForm";

export async function handleEditReadFicInfo(id: string): Promise<void> {
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
    timestamp: Date.now(),
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
    timestamp: Date.now(),
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

export async function handleGetSettings(): Promise<Record<string, Settings>> {
  const { data } = await StorageService.settings.get();
  if (!data || Object.keys(data).length === 0)
    return {
      READ_SETTINGS_ID: DEFAULT_READ_SETTINGS,
      IGNORE_SETTINGS_ID: DEFAULT_IGNORE_SETTINGS,
    };
  return data as Record<string, Settings>;
}
