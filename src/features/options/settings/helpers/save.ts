import { settingsCache } from "@services/cache";
import { handleStorageWrite } from "@utils/storage";
import { getElement, extractSectionValues } from "@utils/ui";

import { PREFIX } from "../..";
import { SectionId, SectionElements } from "../../config";
import { SETTINGS_SAVE_MAP } from "../config";

export function setupSettingsSaveHandlers(sections: SectionElements) {
  for (const [key, sectionConfig] of Object.entries(sections)) {
    const saveBtn = getElement(sectionConfig.element, `.${PREFIX}__button`);
    if (!saveBtn) continue;

    const saveInfo = SETTINGS_SAVE_MAP[key as SectionId];
    if (!saveInfo) continue;

    saveBtn.addEventListener("click", async () => {
      const payload = {
        ...saveInfo.defaults,
        ...extractSectionValues(sectionConfig.element),
      };

      const op = saveInfo.setter(payload);

      await handleStorageWrite<void>(
        op,
        `${
          saveInfo.label.charAt(0).toUpperCase() + saveInfo.label.slice(1)
        } updated successfully.`,
        `Failed to update ${saveInfo.label} settings.`,
        saveBtn || undefined,
        false
      );
      settingsCache.clear();
    });
  }
}
