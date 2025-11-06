import { StorageService } from "../../services/storage";
import { showNotification } from "../../utils/ui";

export async function handleMarkFicAsRead(
  id: string,
  title?: string
): Promise<void> {
  const result = await StorageService.addReadFic({
    id,
    timestamp: Date.now(),
    title: title,
  });
  if (result.success) showNotification(`Fic ${id} marked as read.`);
  else showNotification(`Failed to mark fic ${id} as read: ${result.error}`);
}

export async function handleMarkFicAsUnread(id: string): Promise<void> {
  const result = await StorageService.removeReadFic(id);
  if (result.success) showNotification(`Fic ${id} marked as unread.`);
  else showNotification(`Failed to mark fic ${id} as unread: ${result.error}`);
}

export async function handleIgnoreFic(
  id: string,
  title?: string,
  reason?: string
): Promise<void> {
  const result = await StorageService.addIgnoredFic({
    id,
    timestamp: Date.now(),
    title: title,
    reason: reason,
  });
  if (result.success) showNotification(`Fic ${id} is now being ignored.`);
  else showNotification(`Failed to ignore fic ${id}: ${result.error}`);
}

export async function handleUnignoreFic(id: string): Promise<void> {
  const result = await StorageService.removeIgnoredFic(id);
  if (result.success) showNotification(`Fic ${id} is no longer being ignored.`);
  else showNotification(`Failed to unignore fic ${id}: ${result.error}`);
}
