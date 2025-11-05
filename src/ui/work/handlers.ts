import { STORAGE_KEYS } from "../../constants/settings";
import { Storage } from "../../services/storage";
import { showNotification } from "../../utils/ui";

export async function handleMarkFicAsRead(
  id: string,
  title?: string
): Promise<void> {
  const result = await Storage.add(STORAGE_KEYS.READ, id, {
    timestamp: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Fic ${id} marked as read.`);
  else showNotification(`Failed to mark fic ${id} as read: ${result.error}`);
}

export async function handleMarkFicAsUnread(id: string): Promise<void> {
  const result = await Storage.remove(STORAGE_KEYS.READ, id);
  if (result.success) showNotification(`Fic ${id} marked as unread.`);
  else showNotification(`Failed to mark fic ${id} as unread: ${result.error}`);
}

export async function handleIgnoreFic(
  id: string,
  title?: string,
  reason?: string
): Promise<void> {
  const result = await Storage.add(STORAGE_KEYS.IGNORED, id, {
    timestamp: Date.now(),
    title: title,
    reason: reason,
  });
  if (result.success) showNotification(`Fic ${id} is now being ignored.`);
  else showNotification(`Failed to ignore fic ${id}: ${result.error}`);
}

export async function handleUnignoreFic(id: string): Promise<void> {
  const result = await Storage.remove(STORAGE_KEYS.IGNORED, id);
  if (result.success) showNotification(`Fic ${id} is no longer being ignored.`);
  else showNotification(`Failed to unignore fic ${id}: ${result.error}`);
}
