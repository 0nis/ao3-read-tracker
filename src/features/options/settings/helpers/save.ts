import { SETTINGS_SAVE_MAP, SettingsSectionTypeMap } from "../config";
import { SettingsSectionConfig } from "../types";

import { handleStorageWrite } from "../../../../utils/storage";
import { extractFormValues } from "../../../../utils/ui/forms";

export async function saveSettingsData<K extends keyof SettingsSectionTypeMap>(
  cfg: SettingsSectionConfig<SettingsSectionTypeMap[K]> & { id: K },
  saveBtn: HTMLButtonElement
): Promise<void> {
  try {
    const saveInfo = SETTINGS_SAVE_MAP[cfg.id];
    if (!saveInfo)
      return Promise.reject(
        new Error(`No save info for settings section id: ${cfg.id}`)
      );

    const payload: SettingsSectionTypeMap[K] = {
      ...saveInfo.defaults,
      ...extractFormValues(cfg.items),
    };
    const op = saveInfo.setter(payload);

    await handleStorageWrite<void>(op, {
      successMsg: `${
        saveInfo.label.charAt(0).toUpperCase() + saveInfo.label.slice(1)
      } updated successfully.`,
      errorMsg: `Failed to update ${saveInfo.label} settings.`,
      loadingEl: saveBtn || undefined,
      enforceMinDelay: false,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}
