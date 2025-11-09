import {
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";
import { StorageService } from "../../services/storage";
import { Settings } from "../../types/storage";
import { showNotification } from "../../utils/ui";
import { showIgnoredFicForm } from "./form/ignoredForm";
import { showReadFicForm } from "./form/readForm";

export async function handleMarkFicAsRead(
  id: string,
  title: string,
  isSimpleModeEnabled: boolean = true
): Promise<void> {
  if (isSimpleModeEnabled) {
    const result = await StorageService.addReadFic({
      id,
      timestamp: Date.now(),
      title: title,
    });
    if (result.success) showNotification(`Fic ${id} marked as read.`);
    else showNotification(`Failed to mark fic ${id} as read: ${result.error}`);
  } else showReadFicForm(id, title);
}

export async function handleMarkFicAsUnread(id: string): Promise<void> {
  const result = await StorageService.removeReadFic(id);
  if (result.success) showNotification(`Fic ${id} marked as unread.`);
  else showNotification(`Failed to mark fic ${id} as unread: ${result.error}`);
}

export async function handleIgnoreFic(
  id: string,
  title: string,
  isSimpleModeEnabled: boolean = true
): Promise<void> {
  if (isSimpleModeEnabled) {
    const result = await StorageService.addIgnoredFic({
      id,
      timestamp: Date.now(),
      title: title,
    });
    if (result.success) showNotification(`Fic ${id} is now being ignored.`);
    else showNotification(`Failed to ignore fic ${id}: ${result.error}`);
  } else showIgnoredFicForm(id, title);
}

export async function handleUnignoreFic(id: string): Promise<void> {
  const result = await StorageService.removeIgnoredFic(id);
  if (result.success) showNotification(`Fic ${id} is no longer being ignored.`);
  else showNotification(`Failed to unignore fic ${id}: ${result.error}`);
}

export async function handleGetSettings(): Promise<Record<string, Settings>> {
  const result = await StorageService.getSettings();
  console.log(result);
  if (!result.success || !result.data || Object.keys(result.data).length === 0)
    return {
      READ_SETTINGS_ID: DEFAULT_READ_SETTINGS,
      IGNORE_SETTINGS_ID: DEFAULT_IGNORE_SETTINGS,
    };
  return result.data as Record<string, Settings>;
}
