import { StorageService } from "../../services/storage";
import { StorageResult } from "../../types/storage";
import { showNotification } from "../../utils/dialogs";

export async function getSettingsHandler<T>(
  service: () => Promise<StorageResult<T>>,
  defaultSettings: T,
  label: string
): Promise<T> {
  const result = await service();
  if (result.success && result.data && result.data !== undefined) {
    return result.data as T;
  } else {
    showNotification(
      `Failed to retrieve ${label} settings${
        result.error ? `: ${result.error}` : ""
      }. Using default settings.`
    );
    return defaultSettings;
  }
}

export async function updateSettingsHandler<T extends { id: string }>(
  service: (settings: T) => Promise<any>,
  settings: T,
  label: string
): Promise<void> {
  const result = await service(settings);
  if (result.success) {
    showNotification(`${label} settings updated successfully.`);
  } else {
    showNotification(`Failed to update ${label} settings: ${result.error}.`);
  }
}
