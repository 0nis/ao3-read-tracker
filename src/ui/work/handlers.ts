import { STORAGE_KEYS } from "../../constants/settings";
import { Storage } from "../../services/storage";
import { showNotification } from "../../utils/ui";

export async function handleMarkFicAsRead(ficId: string): Promise<void> {
  const result = await Storage.add(STORAGE_KEYS.READ, {
    id: ficId,
    timestamp: Date.now(),
  });
  if (result.success) showNotification(`Fic ${ficId} marked as read.`);
  else showNotification(`Failed to mark fic ${ficId} as read: ${result.error}`);
}
export async function handleMarkFicAsUnread(ficId: string): Promise<void> {
  const result = await Storage.remove(STORAGE_KEYS.READ, ficId);
  if (result.success) showNotification(`Fic ${ficId} marked as unread.`);
  else
    showNotification(`Failed to mark fic ${ficId} as unread: ${result.error}`);
}
export async function handleIgnoreFic(ficId: string): Promise<void> {
  const result = await Storage.add(STORAGE_KEYS.IGNORED, {
    id: ficId,
    timestamp: Date.now(),
  });
  if (result.success) showNotification(`Fic ${ficId} is now being ignored.`);
  else showNotification(`Failed to ignore fic ${ficId}: ${result.error}`);
}
export async function handleUnignoreFic(ficId: string): Promise<void> {
  const result = await Storage.remove(STORAGE_KEYS.IGNORED, ficId);
  if (result.success)
    showNotification(`Fic ${ficId} is no longer being ignored.`);
  else showNotification(`Failed to unignore fic ${ficId}: ${result.error}`);
}
