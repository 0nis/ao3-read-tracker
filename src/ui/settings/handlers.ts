import {
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
  IGNORE_SETTINGS_ID,
  READ_SETTINGS_ID,
} from "../../constants/settings";
import { StorageService } from "../../services/storage";
import { Settings } from "../../types/storage";
import { showNotification } from "../../utils/ui";

export async function getReadSettings(): Promise<Settings> {
  const result = await StorageService.getSettings(READ_SETTINGS_ID);
  if (result.success) {
    return (result.data as Settings) || DEFAULT_READ_SETTINGS;
  } else {
    showNotification(
      `Failed to retrieve read settings: ${result.error}. Using default settings.`
    );
    return DEFAULT_READ_SETTINGS;
  }
}

export async function getIgnoreSettings(): Promise<Settings> {
  const result = await StorageService.getSettings(IGNORE_SETTINGS_ID);
  if (result.success) {
    return (result.data as Settings) || DEFAULT_IGNORE_SETTINGS;
  } else {
    showNotification(
      `Failed to retrieve ignore settings: ${result.error}. Using default settings.`
    );
    return DEFAULT_IGNORE_SETTINGS;
  }
}

export async function updateReadSettings(settings: Settings): Promise<void> {
  const result = await StorageService.updateSettings(settings);
  if (result.success) {
    showNotification("Read settings updated successfully.");
  } else {
    showNotification(`Failed to update read settings: ${result.error}.`);
  }
}

export async function updateIgnoreSettings(settings: Settings): Promise<void> {
  const result = await StorageService.updateSettings(settings);
  if (result.success) {
    showNotification("Ignore settings updated successfully.");
  } else {
    showNotification(`Failed to update ignore settings: ${result.error}.`);
  }
}
