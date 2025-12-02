import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";
import { StorageResult } from "../../types/results";
import { SettingsData } from "../../types/settings";
import { StorageService } from "../../services/storage";
import { reportExtensionFailure } from "../ui/dialogs";

const SETTINGS_LOADERS: Record<
  keyof SettingsData,
  () => Promise<StorageResult<any>>
> = {
  readSettings: StorageService.readSettings.get,
  ignoreSettings: StorageService.ignoreSettings.get,
  generalSettings: StorageService.generalSettings.get,
};

const SETTINGS_DEFAULTS: SettingsData = {
  readSettings: DEFAULT_READ_SETTINGS,
  ignoreSettings: DEFAULT_IGNORE_SETTINGS,
  generalSettings: DEFAULT_GENERAL_SETTINGS,
};

const SETTINGS_LABELS: Record<keyof SettingsData, string> = {
  readSettings: "read",
  ignoreSettings: "ignore",
  generalSettings: "general",
};

/** Retrieves all settings from storage, applying default values for any that fail to load. */
export async function handleGetAllSettings(): Promise<SettingsData> {
  const finalSettings: SettingsData = { ...SETTINGS_DEFAULTS };
  let failures: Record<string, unknown>[] = [];

  for (const key of Object.keys(SETTINGS_LOADERS) as (keyof SettingsData)[]) {
    const result = await SETTINGS_LOADERS[key]();

    if (result.success && result.data !== undefined) {
      finalSettings[key] = result.data;
    } else {
      failures.push({ [SETTINGS_LABELS[key]]: result.error });
    }
  }

  if (failures.length > 0) {
    reportExtensionFailure(
      `Failed to retrieve: ${failures
        .map((failure) => Object.keys(failure).join(", "))
        .join(", ")} settings. Default values were applied.`,
      failures
    );
  }

  return finalSettings as SettingsData;
}
