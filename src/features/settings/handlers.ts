import { StorageService } from "../../services/storage";
import { StorageResult } from "../../types/storage";
import { reportExtensionFailure, showNotification } from "../../utils/dialogs";
import { handleStorageResult } from "../../utils/form";

export async function getSettingsHandler<T>(
  service: () => Promise<StorageResult<T>>,
  defaultSettings: T,
  label: string
): Promise<T> {
  const result = await service();
  if (result.success && result.data && result.data !== undefined) {
    return result.data as T;
  } else {
    reportExtensionFailure(
      `Failed to retrieve ${label} settings. Using default settings.`,
      result.error
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
  handleStorageResult(
    result,
    `${label} settings updated successfully.`,
    `Failed to update ${label} settings.`
  );
}
