import { StorageService } from "./storage";
import { reportExtensionFailure } from "../../shared/extension/dialogs";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_IN_PROGRESS_SETTINGS,
  DEFAULT_FINISHED_SETTINGS,
  DEFAULT_SYMBOL_SETTINGS,
  DEFAULT_DISPLAYMODE_SETTINGS,
} from "../../constants/settings";
import { StorageResult } from "../../types/storage";
import { SettingsData } from "../../types/settings";

const SETTINGS_LOADERS: Record<
  keyof SettingsData,
  () => Promise<StorageResult<any>>
> = {
  finishedSettings: StorageService.finishedSettings.get,
  inProgressSettings: StorageService.inProgressSettings.get,
  ignoreSettings: StorageService.ignoreSettings.get,
  generalSettings: StorageService.generalSettings.get,
  symbolSettings: StorageService.symbolSettings.get,
  displayModeSettings: StorageService.displayModeSettings.get,
};

const SETTINGS_DEFAULTS: SettingsData = {
  finishedSettings: DEFAULT_FINISHED_SETTINGS,
  inProgressSettings: DEFAULT_IN_PROGRESS_SETTINGS,
  ignoreSettings: DEFAULT_IGNORE_SETTINGS,
  generalSettings: DEFAULT_GENERAL_SETTINGS,
  symbolSettings: DEFAULT_SYMBOL_SETTINGS,
  displayModeSettings: DEFAULT_DISPLAYMODE_SETTINGS,
};

const SETTINGS_LABELS: Record<keyof SettingsData, string> = {
  finishedSettings: "finished",
  inProgressSettings: "in progress",
  ignoreSettings: "ignore",
  generalSettings: "general",
  symbolSettings: "symbols",
  displayModeSettings: "display modes",
};

/** Retrieves all settings from storage, applying default values for any that fail to load. */
export async function handleGetAllSettings(): Promise<SettingsData> {
  const finalSettings: SettingsData = { ...SETTINGS_DEFAULTS };
  let failures: Record<string, unknown>[] = [];

  for (const key of Object.keys(SETTINGS_LOADERS) as (keyof SettingsData)[]) {
    let result: StorageResult<any>;
    try {
      result = await SETTINGS_LOADERS[key]();
    } catch (error) {
      result = { success: false, error };
    }

    if (result.success && result.data !== undefined) {
      finalSettings[key] = result.data;
    } else {
      failures.push({ [SETTINGS_LABELS[key]]: result.error });
    }
  }

  if (failures.length > 0) {
    reportExtensionFailure(
      `Failed to retrieve ${failures
        .map((failure) => Object.keys(failure).join(", "))
        .join(", ")} settings. Default values were applied.`,
    );
  }

  return finalSettings as SettingsData;
}
