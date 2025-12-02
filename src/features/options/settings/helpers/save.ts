import { PREFIX } from "../..";
import { settingsCache } from "../../../../services/cache/settings";
import { handleStorageWrite } from "../../../../utils/storage/handlers";
import { getElement } from "../../../../utils/ui/dom";
import { extractFormValues } from "../../../../utils/ui/form";
import { SectionElements } from "../../renderer";
import { SectionId } from "../../config";
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
        ...extractFormValues(sectionConfig.element),
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
      settingsCache.clear();
    });
  }
}
