import { StorageService } from "../../services/storage";
import { showNotification } from "../../utils/dom";

export async function getSettings<T>(
  service: ReturnType<typeof StorageService.readSettings.get>,
  defaultSettings: T,
  label: string
): Promise<T> {
  const result = await service;
  if (result.success && result.data) {
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

export async function updateSettings<T extends { id: string }>(
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
